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
import { VisuallyHiddenInput } from "@/features/img-loading";
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
import MuiPhoneNumber from "mui-phone-number";
import { user_img2 } from "@/assests/users";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("en"); // use locale

const ProfileForm = ({ info }: { info?: UserInfo }) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState<any>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(
    info || {
      fullname: "",
      email: "",
      phone: "",
      dob: dayjs().toISOString(),
      gender: "",
      address: "",
      avatar: "",
      ewallet: 0,
      role: "GUEST",
    }
  );

  useEffect(() => {
    if (info) {
      setUser(info);
      setUserInfo({
        ...info,
        fullname: info.fullname ? info.fullname : "",
        email: info.email ? info.email : "",
        phone: info.phone ? info.phone : "",
        dob: info.dob ? info.dob : dayjs().toISOString(),
        gender: info.gender ? info.gender : "",
        address: info.address ? info.address : "",
        avatar: info.avatar ? info.avatar : "no avatar",
        ewallet: 0,
      });
      setAvatar(info.avatar || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, router]);

  const handleUserInfo = (e: any) => {
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [e.target.name]: value,
    });
    setIsUpdating(true);

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
  };

  const handlePhone = (value: any) => {
    setUserInfo({
      ...userInfo,
      phone: value,
    });
    setIsUpdating(true);
  };

  const handleUserBirthDay = (date: any) => {
    setUserInfo({
      ...userInfo,
      dob: date.format("DD/MM/YYYY"),
    });
    setIsUpdating(true);
  };
  function resetUserInfo() {
    setUserInfo({
      fullname: "",
      email: "",
      phone: "",
      dob: dayjs().toISOString(),
      gender: "",
      address: "",
      avatar: "",
      ewallet: 0,
      role: "GUEST",
    });
    setAvatar("");
    setIsUpdating(false);
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isUpdating) return;
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
    const formData = new FormData();
    formData.append("fullname", userInfo.fullname || "");
    formData.append("phone", userInfo.phone || "");
    formData.append("dob", dayjs(userInfo.dob).format("MM/DD/YYYY"));
    formData.append("gender", userInfo.gender || "");
    formData.append("address", userInfo.address || "");
    // formData.append("avatar", avatar || "");
    formData.append("ewallet", userInfo.ewallet?.toString() || "");
    if (avatar instanceof File) {
      formData.append("avatar", avatar || "");
    }
    const id = toast.loading("Đang cập nhật...");
    const profile = await updateProfile(getCookie("accessToken")!, formData);
    if (profile.success) {
      toast.update(id, {
        render: `Cập nhật thành công`,
        type: "success",
        autoClose: 1500,
        isLoading: false,
      });
      router.refresh();
    } else {
      if (profile.statusCode == 401) {
        toast.update(id, {
          render: `Phiên đăng nhập hết hạn, đang tạo phiên mới`,
          type: "warning",
          autoClose: 1500,
          isLoading: false,
        });
        setAvatar("");
        setIsUpdating(false);
        router.refresh();
      } else if (profile.statusCode == 400) {
        toast.update(id, {
          render: `Định dạng số điện thoại chưa chính xác`,
          type: "warning",
          autoClose: 1500,
          isLoading: false,
        });
        setAvatar("");
        setIsUpdating(false);
        router.refresh();
      } else if (profile.statusCode == 409) {
        toast.update(id, {
          render: `Số điện thoại đã tồn tại`,
          type: "warning",
          autoClose: 1500,
          isLoading: false,
        });

        setAvatar("");
        setIsUpdating(false);
        router.refresh();
      } else if (profile.statusCode == 500) {
        toast.update(id, {
          render: `Không thể tải ảnh nếu sử dụng tài khoản google hoặc facebook`,
          type: "warning",
          autoClose: 1500,
          isLoading: false,
        });

        setAvatar("");
        setIsUpdating(false);
        router.refresh();
      }
      if (profile.status == 500) {
        toast.update(id, {
          render: `Chỉ hỗ trợ định dạng tệp PNG,JPG,JPEG`,
          type: "warning",
          autoClose: 1500,
          isLoading: false,
        });

        setAvatar("");
        setIsUpdating(false);
        router.refresh();
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setAvatar(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setUserInfo({
            ...userInfo,
            avatar: imageUrl,
          });
          setIsUpdating(true);
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
          Thông tin cá nhân
        </h2>
        <form
          className="col-span-full lg:col-span-7 grid grid-cols-12 border-r-[0] lg:border-r border-border-color max-lg:order-2 mt-4"
          onSubmit={handleSubmit}
        >
          <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="fullname">Tên đầy đủ</InputLabel>
              <OutlinedInput
                value={userInfo.fullname}
                onChange={handleUserInfo}
                fullWidth
                name="fullname"
                id="fullname"
                label="Tên đầy đủ"
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
              <MuiPhoneNumber
                // inputProps={{ maxLength: 10 }}
                value={userInfo.phone}
                disableAreaCodes={true}
                // disableCountryCode={true}
                defaultCountry={"vn"}
                onChange={handlePhone}
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
              <FormLabel className="text-[#333] min-w-fit">
                Giới tính :{" "}
              </FormLabel>
              <RadioGroup
                name="gender"
                value={userInfo.gender}
                onChange={handleUserInfo}
                row
                aria-labelledby="gender-label"
              >
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="MALE"
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value="OTHER"
                  control={<Radio />}
                  label="Khác"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-10 lg:col-start-2 flex items-center text-sm text-[#999] font-medium mb-7">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
              <DatePicker
                value={dayjs(userInfo.dob)}
                onChange={(newValue: any) => handleUserBirthDay(newValue)}
                className="w-full"
              />
            </LocalizationProvider>
          </div>
          <div className="col-span-full lg:col-span-11">
            <button
              disabled={!isUpdating}
              className={`${
                !isUpdating ? "bg-text-light-color" : "bg-primary-color"
              } transition-all duration-200 ${
                !isUpdating ? "" : "hover:bg-text-color"
              } py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]`}
              type="submit"
            >
              Lưu
            </button>
          </div>
        </form>
        <div className="col-span-full lg:col-span-3 xl:col-span-5 min-w-max max-lg:order-1 mt-4">
          <div className="grid place-items-center text-sm text-[#999] font-medium">
            {userInfo.avatar == "" ? (
              <Skeleton variant="circular" width={112} height={112} />
            ) : userInfo.avatar == "no avatar" ? (
              <div className="text-[16px] pb-4 text-center">
                Không có ảnh đại diện nào
              </div>
            ) : (
              userInfo.avatar && (
                <Image
                  // loader={imageLoader}
                  // blurDataURL={userInfo.avatar!}
                  // placeholder="blur"
                  className="rounded-full w-[7rem] h-[7rem]"
                  width={300}
                  height={0}
                  src={userInfo.avatar !== "" ? userInfo.avatar : user_img2}
                  priority={true}
                  alt="Uploaded Image"
                ></Image>
              )
            )}
            <Button
              sx={{ marginTop: "1rem", background: "#639df1" }}
              component="label"
              variant="contained"
              className="mt-4 bg-primary-color hover:bg-text-color"
            >
              Tải ảnh lên
              <VisuallyHiddenInput
                onChange={(e) => handleImageUpload(e)}
                type="file"
              />
            </Button>
            <p className="text-[1rem] pt-4 pl-20 sm:pl-24 md:pl-40 lg:pl-20 justify-self-center lg:justify-self-start w-full">
              Dung lượng tệp không quá 20MB
            </p>
            <p className="text-[1rem] pb-4 pl-20 sm:pl-24 md:pl-40 lg:pl-20 justify-self-center lg:justify-self-start w-full">
              Định dạng tệp: JPG, PNG,...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
