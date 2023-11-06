"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/de";
import moment from "moment";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [gender, setGender] = useState("Female");
  const [phonenumber, setPhoneNumber] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
    console.log({
      username,
      fullname,
      email,
      birthdate: moment(birthdate).format("LL"),
      gender,
      profileImage,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setProfileImage(imageUrl);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCustomButtonClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
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
            <InputLabel className="mb-2" htmlFor="username">
              Username
            </InputLabel>
            <OutlinedInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              id="username"
              // placeholder="Type your username"
              label="Username"
            />
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full">
            <InputLabel htmlFor="fullname">Fullname</InputLabel>
            <OutlinedInput
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              fullWidth
              id="fullname"
              // placeholder="Type your fullname"
              label="fullname"
            />
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              id="email"
              // placeholder="Type your email"
              label="email"
            />
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-10 lg:col-start-2 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full">
            <InputLabel htmlFor="phone">Phone</InputLabel>
            <OutlinedInput
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
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
            <FormLabel className="text-[#333] min-w-fit">Gender</FormLabel>
            <RadioGroup
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-10 lg:col-start-2 flex items-center text-sm text-[#999] font-medium mb-7">
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
            <DatePicker
              value={birthdate}
              onChange={(date: Date | null) => setBirthdate(date)}
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
          {profileImage ? (
            <Image
              onClick={() => {
                handleCustomButtonClick();
              }}
              className="rounded-full w-[100px] h-[100px]"
              width={300}
              height={300}
              src={profileImage}
              alt="Uploaded Image"
            ></Image>
          ) : (
            <div
              onClick={() => {
                handleCustomButtonClick();
              }}
              className="text-[16px] pb-4 text-center"
            >
              No Avatar Selected
            </div>
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
  );
};

export default ProfilePage;
