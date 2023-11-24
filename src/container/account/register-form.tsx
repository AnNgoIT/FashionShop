"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Account } from "@/features/types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import MuiPhoneNumber from "mui-phone-number";
import validateRegisterForm from "@/features/validation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteUnverifyEmail, register, sendOTP } from "@/hooks/useAuth";
import { VerifyEmailContext } from "@/store";
import InputAdornment from "@mui/material/InputAdornment";
import ShowHidePassword from "@/features/visibility";

const RegisterForm = () => {
  const router = useRouter();

  const { verifyEmail, setVerifyEmail } = useContext(VerifyEmailContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [account, setAccount] = useState<Account>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Account>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleAccountValue = (e: any) => {
    const value = e.target.value;
    setAccount({
      ...account,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handlePhone = (value: any) => {
    setAccount({
      ...account,
      phone: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      ...errors,
      phone: "",
    });
  };

  const isError = (error: Account) => {
    for (const key in error) {
      if (error[key as keyof Account] !== "") {
        return false; // Nếu có ít nhất một giá trị trống, trả về true
      }
    }
    return true; // Nếu tất cả giá trị đều không trống, trả về false
  };
  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const newAccount: Account = {
      fullname: account.fullname,
      email: account.email,
      phone: account.phone,
      password: account.password,
      confirmPassword: account.confirmPassword,
    };

    const formErrors = validateRegisterForm(newAccount);

    // Nếu không có lỗi, tiến hành submit form
    if (isError(formErrors)) {
      // Xử lý logic đăng ký ở đây

      const id = toast.loading("Please wait...");
      const response = await register(newAccount);

      if (response.success) {
        setVerifyEmail({
          email: newAccount.email,
        });
        const sendEmail = await sendOTP({ email: newAccount.email });
        if (sendEmail.success) {
          toast.update(id, {
            render: `A verify email sent to ${newAccount.email}`,
            type: "success",
            autoClose: 3000,
            isLoading: false,
          });
          router.push("/register/verify-email");
        } else {
          const unverify = await deleteUnverifyEmail(verifyEmail.email);
          if (unverify.success) {
            setVerifyEmail({
              email: "",
            });
          }
        }
      } else {
        toast.update(id, {
          render: response.message,
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
        if (response.message === "Email already in use") {
          setErrors({
            ...errors,
            email: response.message,
          });
        } else if (response.message === "Phone number already in use") {
          setErrors({
            ...errors,
            phone: response.message,
          });
        }
      }
    } else setErrors(formErrors);
  };

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10 rounded-md`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold mb-6 text-center">
        register
      </h2>
      <Box
        component="form"
        onSubmit={handleRegister}
        className="col-span-full lg:col-span-10 lg:col-start-2"
      >
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-5">
          <FormControl fullWidth error={errors.fullname != ""}>
            <InputLabel htmlFor="fullname">Full Name *</InputLabel>
            <OutlinedInput
              type="text"
              value={account.fullname}
              onChange={handleAccountValue}
              id="fullname"
              name="fullname"
              label="Full Name *"
              autoComplete="off"
              aria-describedby="fullname"
            />
            <FormHelperText id="fullname-error">
              {errors.fullname}
            </FormHelperText>
          </FormControl>
        </div>
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-5">
          <FormControl fullWidth error={errors.email != ""}>
            <InputLabel htmlFor="email">Email *</InputLabel>
            <OutlinedInput
              type="text"
              value={account.email}
              onChange={handleAccountValue}
              id="email"
              name="email"
              label="Email *"
              aria-describedby="email"
            />
            <FormHelperText id="email-error">{errors.email}</FormHelperText>
          </FormControl>
        </div>
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-5">
          <FormControl fullWidth error={errors.phone != ""}>
            <MuiPhoneNumber
              inputProps={{ maxLength: 10 }}
              // value={account.phone}
              disableAreaCodes={true}
              disableCountryCode={true}
              defaultCountry={"vn"}
              onChange={handlePhone}
            />
            <FormHelperText id="phone-error">{errors.phone}</FormHelperText>
          </FormControl>
        </div>
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-5">
          <FormControl fullWidth error={errors.password != ""}>
            <InputLabel htmlFor="password">Password *</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={account.password}
              onChange={handleAccountValue}
              endAdornment={
                <InputAdornment position="end">
                  <ShowHidePassword
                    showPassword={showPassword}
                    click={handleClickShowPassword}
                    mousedownPassword={handleMouseDownPassword}
                  />
                </InputAdornment>
              }
              id="password"
              autoComplete="off"
              name="password"
              label="Password *"
              aria-describedby="password"
            />
            <FormHelperText id="password-error">
              {errors.password}
            </FormHelperText>
          </FormControl>
        </div>
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-5">
          <FormControl fullWidth error={errors.confirmPassword != ""}>
            <InputLabel htmlFor="confirmPassword">
              Confirm Password *
            </InputLabel>
            <OutlinedInput
              type="password"
              value={account.confirmPassword}
              onChange={handleAccountValue}
              id="confirmPassword"
              autoComplete="off"
              name="confirmPassword"
              label="Confirm Password *"
              aria-describedby="confirmPassword"
            />
            <FormHelperText id="confirmPassword-error">
              {errors.confirmPassword}
            </FormHelperText>
          </FormControl>
        </div>
        <button
          type="submit"
          className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[18px] 
                           float-right px-[26px] text-white rounded-[5px]"
        >
          Register
        </button>
      </Box>
      <div className="col-span-full text-[14px] leading-[28px] text-center font-medium text-primary-color mt-5">
        <p className="text-[#999]">
          Already have an account?
          <Link href="/login" prefetch={false}>
            <span className="text-primary-color transition-all duration-200 hover:text-text-color cursor-pointer">
              {" "}
              Login here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
