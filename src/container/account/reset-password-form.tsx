"use client";
import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { resetPassword } from "@/hooks/useAuth";
import FormHelperText from "@mui/material/FormHelperText";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { VerifyEmailContext } from "@/store";
import { validateResetPasswordForm } from "@/features/validation";
import InputAdornment from "@mui/material/InputAdornment";
import ShowHidePassword from "@/features/visibility";

export type ResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};
const ResetPasswordForm = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<ResetPassword>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState<ResetPassword>({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { verifyEmail, setVerifyEmail } = useContext(VerifyEmailContext);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVerifyEmail({ email: "" });
    }, 120000); // Thời gian tính bằng miligiây, 120000 miligiây = 2 phút

    // Xóa timeout khi component unmount để tránh memory leak
    return () => clearTimeout(timeout);
  });

  // Kiểm tra điều kiện trước khi render
  if (verifyEmail.email === "") {
    redirect("/forgot-password");
  }

  const handleNewPassword = (e: any) => {
    const value = e.target.value;
    setNewPassword({
      ...newPassword,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const isError = (error: any) => {
    for (const key in error) {
      if (error[key] !== "" && key !== "email") {
        return false; // Nếu có ít nhất một giá trị trống, trả về true
      }
    }
    return true; // Nếu tất cả giá trị đều không trống, trả về false
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const password: ResetPassword = {
      email: verifyEmail.email,
      otp: newPassword.otp.toString(),
      newPassword: newPassword.newPassword,
      confirmPassword: newPassword.confirmPassword,
    };
    // Xử lý logic ở đây
    // Ví dụ: gửi yêu cầu đến máy chủ
    const formErrors = validateResetPasswordForm(password);

    if (isError(formErrors)) {
      const id = toast.loading("Reset Password...");
      const res = await resetPassword(password);
      if (res.success) {
        toast.update(id, {
          render: `Your password has been reset`,
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        router.push("/login");
      } else if (res.statusCode == 400) {
        toast.update(id, {
          render: `Wrong OTP`,
          type: "error",
          autoClose: 1500,
          isLoading: false,
        });
        setErrors({ ...formErrors, otp: "Wrong OTP" });
      }
      // Reset trạng thái trường nhập liệu sau khi xử lý
    } else setErrors(formErrors);
  };

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10`}
    >
      <h2
        className="col-span-full text-xl leading-10 tracking-[0] text-text-color uppercase font-semibold mb-[30px] 
                        text-center"
      >
        reset password
      </h2>
      <form
        className="col-span-full lg:col-span-10 lg:col-start-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={errors.otp != ""}>
            <InputLabel htmlFor="otp">OTP Code</InputLabel>
            <OutlinedInput
              type="number"
              value={newPassword.otp}
              required
              onChange={handleNewPassword}
              id="otp"
              name="otp"
              label="OTP Code"
              autoComplete="off"
              aria-describedby="otp"
            />
          </FormControl>
          <FormHelperText id="fullname-error">{errors.otp}</FormHelperText>
        </div>
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={errors.newPassword != ""}>
            <InputLabel htmlFor="newPassword">New Password</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={newPassword.newPassword}
              required
              onChange={handleNewPassword}
              id="newPassword"
              name="newPassword"
              endAdornment={
                <InputAdornment position="end">
                  <ShowHidePassword
                    showPassword={showPassword}
                    click={handleClickShowPassword}
                    mousedownPassword={handleMouseDownPassword}
                  />
                </InputAdornment>
              }
              label="New Password"
              autoComplete="off"
              aria-describedby="newPassword"
            />
          </FormControl>
          <FormHelperText id="fullname-error">
            {errors.newPassword}
          </FormHelperText>
        </div>
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={errors.confirmPassword != ""}>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              type="password"
              value={newPassword.confirmPassword}
              required
              onChange={handleNewPassword}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              autoComplete="off"
              aria-describedby="confirmPassword"
            />
          </FormControl>
          <FormHelperText id="fullname-error">
            {errors.confirmPassword}
          </FormHelperText>
        </div>
        <button
          className="bg-primary-color w-full transition-all duration-200 hover:bg-text-color py-[10px] 
                           float-right px-[20px] text-white rounded-[5px]"
          type="submit"
        >
          Change
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
