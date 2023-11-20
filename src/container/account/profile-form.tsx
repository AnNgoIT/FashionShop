"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "moment/locale/de";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import { VisuallyHiddenInput, imageLoader } from "@/features/img-loading";
import { UserInfo } from "@/features/types";
import { UserContext } from "@/store";
import dayjs from "dayjs";
import { updateProfile } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import isLeapYear from "dayjs/plugin/isLeapYear"; // import plugin
import "dayjs/locale/en"; // import locale
import Skeleton from "@mui/material/Skeleton";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("en"); // use locale

const ProfileForm = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullname: "",
    email: "",
    phone: "",
    dob: dayjs(),
    gender: "",
    address: "",
    avatar: "",
    ewallet: 0,
  });

  useEffect(() => {
    setUserInfo({
      ...user,
      fullname: user.fullname ? user.fullname : "",
      email: user.email ? user.email : "",
      phone: user.phone ? user.phone : "",
      dob: dayjs(),
      gender: user.gender ? user.gender : "",
      address: user.address ? user.address : "",
      avatar: user.avatar ? user.avatar : "no avatar",
      ewallet: 0,
    });
  }, [user]);

  const handleUserInfo = (e: any) => {
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
  };

  const handleUserBirthDay = (date: any) => {
    setUserInfo({
      ...userInfo,
      dob: date.format("DD/MM/YYYY"),
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
    const formData = new FormData();
    formData.append("fullname", userInfo.fullname || "");
    formData.append("email", userInfo.email || "");
    formData.append("gender", userInfo.gender || "");
    formData.append("address", userInfo.address || "");
    formData.append("dob", userInfo.dob);
    formData.append("phone", userInfo.phone || "");

    console.log(formData.getAll("dob"));

    //   const profile = await updateProfile(getCookie("accessToken")!, formData);
    //   const id = toast.loading("Updating...");
    //   if (profile.success) {
    //     toast.update(id, {
    //       render: `Updated Success`,
    //       type: "success",
    //       autoClose: 1500,
    //       isLoading: false,
    //     });
    //     const newProfile: UserInfo = {
    //       fullname: null,
    //       email: "",
    //       phone: "",
    //       dob: undefined,
    //       gender: null,
    //       address: null,
    //       avatar: null,
    //       ewallet: null,
    //     };

    //     setUser({ ...newProfile, ...user });
    //     router.refresh();
    //   } else if (profile.statusCode == 401) {
    //     toast.update(id, {
    //       render: `Please Login!`,
    //       type: "warning",
    //       autoClose: 1500,
    //       isLoading: false,
    //     });
    //     router.push("/login");
    //   } else {
    //     toast.update(id, {
    //       render: `${profile.message}!`,
    //       type: "error",
    //       autoClose: 1500,
    //       isLoading: false,
    //     });
    //   }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          console.log(imageUrl);
          setUserInfo({
            ...userInfo,
            avatar: imageUrl,
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div
        className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
        bg-white p-5 max-lg:px-10 rounded-sm mb-8 h-fit`}
      >
        <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center pb-4 border-b-[0] lg:border-b border-border-color">
          Profile
        </h2>
        <form
          className="col-span-full lg:col-span-7 grid grid-cols-12 border-r-[0] lg:border-r border-border-color max-lg:order-2 mt-4"
          onSubmit={handleSubmit}
        >
          <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="fullname">Fullname</InputLabel>
              <OutlinedInput
                value={userInfo.fullname}
                onChange={handleUserInfo}
                fullWidth
                name="fullname"
                id="fullname"
                label="fullname"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                readOnly={true}
                disabled={true}
                value={userInfo.email}
                onChange={handleUserInfo}
                fullWidth
                name="email"
                id="email"
                label="email"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="phone">Phone</InputLabel>
              <OutlinedInput
                value={userInfo.phone}
                onChange={handleUserInfo}
                fullWidth
                name="phone"
                id="phone"
                // placeholder="Type your phone"
                label="phone"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-10 lg:col-start-2 text-center text-sm text-[#999] font-medium mb-4">
            <FormControl
              sx={{
                display: "flex",
                alignItems: "items-center",
                flexDirection: "row",
              }}
              className="flex items-center gap-x-2 flex-row"
            >
              <FormLabel className="text-[#333] min-w-fit">Gender : </FormLabel>
              <RadioGroup
                name="gender"
                value={userInfo.gender}
                onChange={handleUserInfo}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="MALE"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="OTHER"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-10 lg:col-start-2 flex items-center text-sm text-[#999] font-medium mb-7">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
              <DatePicker
                value={userInfo.dob}
                onChange={(newValue: any) => handleUserBirthDay(newValue)}
                className="w-full"
              />
            </LocalizationProvider>
          </div>
          <div className="col-span-full lg:col-span-11">
            <button
              className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
        <div className="col-span-full lg:col-span-3 xl:col-span-5 min-w-max max-lg:order-1 mt-4">
          <div className="grid place-items-center text-sm text-[#999] font-medium">
            {userInfo.avatar == "" ? (
              <Skeleton variant="circular" width={112} height={112} />
            ) : userInfo.avatar == "no avatar" ? (
              <div className="text-[16px] pb-4 text-center">
                No Avatar Selected
              </div>
            ) : (
              <Image
                loader={imageLoader}
                priority={true}
                className="rounded-full w-[7rem] h-[7rem]"
                width={300}
                height={300}
                src={userInfo.avatar!}
                alt="Uploaded Image"
              ></Image>
            )}
            <Button
              sx={{ marginTop: "1rem", background: "#639df1" }}
              component="label"
              variant="contained"
              className="mt-4 bg-primary-color hover:bg-text-color"
            >
              Upload file
              <VisuallyHiddenInput
                onChange={(e) => handleImageUpload(e)}
                type="file"
              />
            </Button>
            <p className="text-[1rem] pt-4 pl-20 sm:pl-24 md:pl-40 lg:pl-20 justify-self-center lg:justify-self-start w-full">
              File capacity not more than 1MB
            </p>
            <p className="text-[1rem] pb-4 pl-20 sm:pl-24 md:pl-40 lg:pl-20 justify-self-center lg:justify-self-start w-full">
              File format: JPG, PNG,...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
