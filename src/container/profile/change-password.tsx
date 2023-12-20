"use client";
import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { deleteCookie, getCookie } from "cookies-next";
import { changePassword } from "@/hooks/useAuth";
import { validateChangePasswordForm } from "@/features/validation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { warningMessage } from "@/features/toasting";
import InputAdornment from "@mui/material/InputAdornment";
import ShowHidePassword from "@/features/visibility";
const ChangePassword = () => {
  const router = useRouter();
  const [userPassword, setUserPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const isError = (error: any) => {
    for (const key in error) {
      if (error[key] !== "") {
        return false; // Nếu có ít nhất một giá trị trống, trả về true
      }
    }
    return true; // Nếu tất cả giá trị đều không trống, trả về false
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setUserPassword({
      ...userPassword,
      [e.target.name]: value.trim(),
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleResetPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const reset = {
      currentPassword: userPassword.currentPassword.trim(),
      newPassword: userPassword.newPassword.trim(),
      confirmPassword: userPassword.confirmPassword.trim(),
    };
    const formErrors = validateChangePasswordForm(reset);

    if (isError(formErrors)) {
      // Xử lý logic reset mật khẩu ở đây
      const id = toast.loading("Đang đổi...");
      const response = await changePassword(getCookie("accessToken")!, reset);
      if (response.success) {
        toast.update(id, {
          render: "Đổi mật khẩu thành công",
          type: "success",
          autoClose: 1500,
          isLoading: false,
        });
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        router.push("/login");
        router.refresh();
      }
      if (response.statusCode == 401) {
        warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
        router.refresh();
      } else if (response.statusCode == 400) {
        toast.update(id, {
          render: "Sai mật khẩu",
          type: "error",
          autoClose: 1500,
          isLoading: false,
        });
        setErrors({
          ...formErrors,
          currentPassword: "Sai mật khẩu",
        });
      }
    } else setErrors(formErrors);
  };

  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
    bg-white p-5 max-lg:px-10 rounded-sm mb-8 h-fit gap-y-1`}
    >
      <div className="col-span-full grid grid-flow-col max-md:grid-flow-row gap-4 place-content-center md:items-center md:place-content-between pb-4 border-b-[0] lg:border-b border-border-color">
        <h2 className="text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center">
          Đổi mật khẩu
        </h2>
      </div>
      <form
        className="col-span-full grid grid-cols-12 py-3"
        onSubmit={handleResetPassword}
      >
        <div className="col-span-full lg:col-span-6 lg:col-start-4 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full" error={errors.currentPassword != ""}>
            <InputLabel className="mb-2" htmlFor="currentPassword">
              Mật khẩu hiện tại
            </InputLabel>
            <OutlinedInput
              fullWidth
              required
              autoComplete="off"
              endAdornment={
                <InputAdornment position="end">
                  <ShowHidePassword
                    showPassword={showPassword}
                    click={handleClickShowPassword}
                    mousedownPassword={handleMouseDownPassword}
                  />
                </InputAdornment>
              }
              type={showPassword ? "text" : "password"}
              value={userPassword.currentPassword}
              onChange={handleChange}
              id="currentPassword"
              name="currentPassword"
              label="Mật khẩu hiện tại"
            />
            <FormHelperText id="currentPassword-error">
              {errors.currentPassword}
            </FormHelperText>
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-6 lg:col-start-4 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full" error={errors.newPassword != ""}>
            <InputLabel className="mb-2" htmlFor="newPassword">
              Mật khẩu mới
            </InputLabel>
            <OutlinedInput
              fullWidth
              required
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              value={userPassword.newPassword}
              onChange={handleChange}
              id="newPassword"
              name="newPassword"
              // placeholder="Type your newPassword"
              label="Mật khẩu mới"
            />
            <FormHelperText id="password-error">
              {errors.newPassword}
            </FormHelperText>
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-6 lg:col-start-4 text-sm text-[#999] font-medium mb-4">
          <FormControl className="w-full" error={errors.confirmPassword != ""}>
            <InputLabel htmlFor="confirmPassword">
              Xác nhận mật khẩu mới
            </InputLabel>
            <OutlinedInput
              fullWidth
              required
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              onChange={handleChange}
              // placeholder="Type your confirmPassword"
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
            />
            <FormHelperText id="confirmPassword-error">
              {errors.confirmPassword}
            </FormHelperText>
          </FormControl>
        </div>
        <div className="col-span-full lg:col-span-9">
          <button
            className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
            type="submit"
          >
            Đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
