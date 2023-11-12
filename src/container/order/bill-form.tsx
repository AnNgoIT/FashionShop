import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import React, { useState } from "react";

const BillForm = () => {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const addressList = ["Ha Noi", "Ba Dinh"];
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
    // Ví dụ: gửi yêu cầu đăng nhập đến máy chủ

    // Reset trạng thái trường nhập liệu sau khi xử lý
    setFullName("");
    setAddress("");
    setPhoneNumber("");
  };
  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
        <FormControl className="w-full">
          <InputLabel htmlFor="fullname">Fullname</InputLabel>
          <OutlinedInput
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            id="fullname"
            // placeholder="Type your fullname"
            label="fullname"
            required
          />
        </FormControl>
      </div>
      <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
        <FormControl fullWidth>
          <InputLabel id="address">Address</InputLabel>
          <Select
            labelId="address"
            value={address}
            label="Address"
            onChange={(event) => setAddress(event.target.value)}
            required
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {addressList &&
              addressList.map((item) => {
                return (
                  <MenuItem key={`address-${item}`} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
        <FormControl className="w-full">
          <InputLabel htmlFor="phone">Phone</InputLabel>
          <OutlinedInput
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            id="phone"
            type="number"
            // placeholder="Type your phone"
            label="phone"
            required
          />
        </FormControl>
      </div>
    </form>
  );
};

export default BillForm;
