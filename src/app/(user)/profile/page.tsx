"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Input,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/de";

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
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
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
      birthdate,
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
    <section className="container grid grid-cols-12 p-0 max-md:p-4 mt-8 md:mt-12">
      <div
        className={`col-span-full md:col-span-10 md:col-start-3 xl:col-span-8 xl:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
        bg-white py-5 max-lg:px-10 rounded-sm mb-12`}
      >
        <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-center mb-6 mx-6 pb-4 border-b-[0] lg:border-b border-border-color">
          Profile
        </h2>
        <form
          className="col-span-full lg:col-span-7 grid grid-cols-12 border-r-[0] lg:border-r border-border-color mr-4 max-lg:order-2"
          onSubmit={handleSubmit}
        >
          <div className="col-span-full lg:col-span-9 lg:col-start-3 flex items-center text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel className="mb-2" htmlFor="username">
                Username
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="username"
                // placeholder="Type your username"
                label="Username"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9 lg:col-start-3 flex items-center text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="fullname">Fullname</InputLabel>
              <OutlinedInput
                fullWidth
                id="fullname"
                // placeholder="Type your fullname"
                label="fullname"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9 lg:col-start-3 flex items-center text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                fullWidth
                id="email"
                // placeholder="Type your email"
                label="email"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9 lg:col-start-3 flex items-center text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="phone">Phone</InputLabel>
              <OutlinedInput
                fullWidth
                id="phone"
                // placeholder="Type your phone"
                label="phone"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9 lg:col-start-3 text-center text-sm text-[#999] font-medium mb-4">
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
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9 lg:col-start-3 flex items-center text-sm text-[#999] font-medium mb-7">
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="de"
            >
              <DatePicker className="w-full" label="Birthday" />
            </LocalizationProvider>
          </div>
          <Link className="col-span-11" href={"/profile"}>
            <button
              className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
              type="submit"
            >
              Save
            </button>
          </Link>
        </form>
        <div className="col-span-full lg:col-span-3 min-w-max max-lg:order-1">
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
            <p className="text-[16px] pt-4 ssm:pl-16 lg:pl-5 justify-self-center lg:justify-self-start w-full">
              File capacity not more than 1MB
            </p>
            <p className="text-[16px] pb-4 ssm:pl-16 lg:pl-5 justify-self-center lg:justify-self-start w-full">
              File format: JPG, PNG,...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
