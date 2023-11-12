"use client";
import NavigateButton from "@/components/button";
import React, { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import { modalStyle } from "../address/page";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
const ChangePasswordPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [otp, setOTP] = useState<number | null>(null);
  const [otpError, setOTPError] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOTP(null);
    setOpen(false);
  };

  const handleOTP = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (otp) {
      if (otp === 123678) {
        setAuthenticated(true);
        handleClose();
        setOTP(null);
        // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
      } else {
        setOTPError(true);
      }
    }
  };

  const handleChangePassword = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Xử lý dữ liệu form ở đây (gửi đến server, lưu vào cơ sở dữ liệu, vv.)
  };

  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
    bg-white p-5 max-lg:px-10 rounded-sm mb-8 h-fit gap-y-1`}
    >
      <div className="col-span-full grid grid-flow-col max-md:grid-flow-row gap-4 place-content-center md:items-center md:place-content-between pb-4 border-b-[0] lg:border-b border-border-color">
        <h2 className="text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center">
          Change Password
        </h2>
        {!isAuthenticated && (
          <NavigateButton onClick={handleOpen}>
            <EmailIcon sx={{ marginRight: "0.25rem" }} />
            Send Email
          </NavigateButton>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form
            className="col-span-full grid grid-cols-12 py-3"
            onSubmit={handleOTP}
          >
            <div className="col-span-full text-sm text-[#999] font-medium mb-4">
              <FormControl className="w-full" error={otpError}>
                <InputLabel className="mb-2" htmlFor="otp">
                  OTP
                </InputLabel>
                <OutlinedInput
                  autoFocus={true}
                  aria-describedby="component-error-text"
                  value={otp}
                  onChange={(e) =>
                    setOTP(e.target.value ? +e.target.value : null)
                  }
                  type="number"
                  fullWidth
                  required={true}
                  id="otp"
                  // placeholder="Type your otp"
                  label="otp"
                />
                {otpError && (
                  <FormHelperText id="component-error-text">
                    Wrong OTP!
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="col-span-full">
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px] w-full"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      {isAuthenticated ? (
        <form
          className="col-span-full grid grid-cols-12 py-3"
          onSubmit={handleChangePassword}
        >
          <div className="col-span-full lg:col-span-6 lg:col-start-4 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel className="mb-2" htmlFor="New Password">
                New Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="New Password"
                // placeholder="Type your New Password"
                label="New Password"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-6 lg:col-start-4 text-sm text-[#999] font-medium mb-4">
            <FormControl className="w-full">
              <InputLabel htmlFor="Confirm Password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="Confirm Password"
                // placeholder="Type your Confirm Password"
                label="Confirm Password"
              />
            </FormControl>
          </div>
          <div className="col-span-full lg:col-span-9">
            <button
              className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
              type="submit"
            >
              Change
            </button>
          </div>
        </form>
      ) : (
        <div className="min-h-[12.25rem]"></div>
      )}
    </div>
  );
};

export default ChangePasswordPage;
