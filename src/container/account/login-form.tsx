"use client";
import React, { useState } from "react";
import Link from "next/link";
import NavigateButton from "@/components/button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { login } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { decodeToken } from "@/features/jwt-decode";
import { ACCESS_MAX_AGE, REFRESH_MAX_AGE } from "@/hooks/useData";

type Login = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();

  const [account, setAccount] = useState<Login>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const handleAccountValue = (e: any) => {
    const value = e.target.value;
    setAccount({
      ...account,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setError("");
  };

  const handleLogin = async () => {
    const loginAccount: Login = {
      email: account.email,
      password: account.password,
    };

    const response = await login(loginAccount);

    if (response.success) {
      const id = toast.loading("Please wait...");
      toast.update(id, {
        render: `Login Success`,
        type: "success",
        autoClose: 1500,
        isLoading: false,
      });

      setCookie("accessToken", response.result.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(response.result.accessToken)!,
        maxAge: ACCESS_MAX_AGE,
      });
      setCookie("refreshToken", response.result.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(response.result.accessToken)!,
        maxAge: REFRESH_MAX_AGE,
      });
      router.refresh();
      router.push("/");
    } else {
      setError("Incorrect Email or Password, Please try again!");
    }
    // Xử lý logic đăng nhập ở đây
    // Ví dụ: gửi yêu cầu đăng nhập đến máy chủ

    // Reset trạng thái trường nhập liệu sau khi xử lý
  };

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10 rounded-md`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold mb-6 text-center">
        LOGIN
      </h2>
      {error != "" && (
        <div className="col-span-full text-center text-red-600 text-lg font-bold mb-4">
          {error}
        </div>
      )}
      <form className="col-span-full lg:col-span-10 lg:col-start-2">
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
          <FormControl fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              type="text"
              value={account.email}
              onChange={handleAccountValue}
              id="email"
              name="email"
              label="Email"
              autoComplete="off"
              aria-describedby="email"
            />
          </FormControl>
        </div>

        <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
          <FormControl fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              type="password"
              value={account.password}
              onChange={handleAccountValue}
              id="password"
              name="password"
              label="Password"
              autoComplete="off"
              aria-describedby="password"
            />
          </FormControl>
        </div>
        <div className="h-fit float-right">
          <NavigateButton onClick={handleLogin}>Log In</NavigateButton>
        </div>
      </form>
      <h1
        className="col-span-full lg:col-span-10 lg:col-start-2 grid place-items-center w-full pt-2 place-self-start
            relative before:bg-primary-color before:absolute before:top-5 before:w-10 before:right-[40%]
            before:h-0.5 after:bg-primary-color after:absolute 
            after:top-5 after:w-10 after:left-[40%] after:h-0.5 max-xl:after:left-[35%] max-xl:before:right-[35%] -translate-x-2"
      >
        Or
      </h1>
      <div className="col-span-full lg:col-span-6 lg:col-start-4 grid grid-flow-col place-content-center gap-6 pt-2">
        <Button
          sx={{
            padding: "14px 28px",
            background: "#E94134",
            color: "white",
            textTransform: "capitalize",
            "&:hover": {
              background: "#E94134",
              opacity: 0.8,
            },
          }}
          className="bg-[#E94134] py-3.5 px-7 text-white capitalize"
        >
          <GoogleIcon /> Google
        </Button>
        <Button
          sx={{
            padding: "14px 28px",
            background: "#0866FF",
            color: "white",
            textTransform: "capitalize",
            "&:hover": {
              background: "#0866FF",
              opacity: 0.8,
            },
          }}
          className="bg-[#0866FF] py-3.5 px-7 text-white capitalize"
        >
          <FacebookIcon />
          Facebook
        </Button>
      </div>
      <div className="col-span-full text-sm text-center font-medium text-primary-color">
        <Link
          className="flex items-center justify-center"
          href="/forgot-password"
          prefetch={false}
        >
          <h1
            className="hover:text-text-color transition-all duration-200 cursor-pointer
                        py-3 w-fit"
          >
            Forgot your password?
          </h1>
        </Link>
        <p className="text-text-light-color flex justify-center items-center gap-x-2">
          Don&#39;t have an account?
          <Link href="/register" prefetch={false}>
            <span className="text-primary-color transition-all duration-200 hover:text-text-color cursor-pointer">
              Create New Account
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
