"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { getUserRole } from "@/hooks/useData";
import InputAdornment from "@mui/material/InputAdornment";
import ShowHidePassword from "@/features/visibility";
import { successMessage } from "@/features/toasting";
import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from "@/constants";
import useLocal from "@/hooks/useLocalStorage";

type Login = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const local = useLocal();
  const [account, setAccount] = useState<Login>({ email: "", password: "" });
  const [errors] = useState<Login>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleAccountValue = (e: any) => {
    const value = e.target.value;
    setAccount({
      ...account,
      [e.target.name]: value.trim(),
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setError("");
  };

  let isProcessing = false; // Biến cờ để kiểm tra xem có đang xử lý hay không

  const handleLogin = async () => {
    const loginAccount: Login = {
      email: account.email,
      password: account.password,
    };

    if (isProcessing) return; // Nếu đang xử lý, không cho phép gọi API mới
    isProcessing = true; // Đánh dấu đang xử lý

    try {
      const response = await login(loginAccount);
      if (response.success) {
        setCookie("accessToken", response.result.accessToken, {
          expires: decodeToken(response.result.accessToken)!,
        });
        setCookie("refreshToken", response.result.refreshToken, {
          expires: decodeToken(response.result.refreshToken)!,
        });
        const isAdmin = await getUserRole(response.result.accessToken);
        if (isAdmin.success) {
          if (isAdmin.result === "ADMIN") {
            router.push("/admin");
          } else if (isAdmin.result === "SHIPPER") {
            router.push("/shipper");
          } else {
            local.setItem("viewedProducts", JSON.stringify([]));
            successMessage("Đăng nhập thành công");
            router.push("/");
            router.refresh();
          }
        }
      } else {
        toast.dismiss();
        setError("Tài khoản hoặc mật khẩu chưa chính xác, vui lòng thử lại!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      isProcessing = false;
    }
  };

  const handleGoogleLogin = async () => {};

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 rounded-md`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold mb-6 text-center">
        ĐĂNG NHẬP
      </h2>
      {error != "" && (
        <div className="col-span-full text-center text-red-600 text-lg font-bold mb-4">
          {error}
        </div>
      )}
      <form className="col-span-full grid-cols-12 px-6">
        <div className="text-sm text-text-light-color font-medium mb-7">
          <FormControl fullWidth error={errors.email !== ""}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              required
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
        <div className="text-sm text-text-light-color font-medium mb-7">
          <FormControl fullWidth error={errors.password !== ""}>
            <InputLabel htmlFor="password">Mật Khẩu</InputLabel>
            <OutlinedInput
              required
              type={showPassword ? "text" : "password"}
              value={account.password}
              onChange={handleAccountValue}
              id="password"
              name="password"
              label="Mật Khẩu"
              autoComplete="off"
              aria-describedby="password"
              endAdornment={
                <InputAdornment position="end">
                  <ShowHidePassword
                    showPassword={showPassword}
                    click={handleClickShowPassword}
                    mousedownPassword={handleMouseDownPassword}
                  />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className="h-fit float-right">
          <NavigateButton onClick={handleLogin}>Đăng Nhập</NavigateButton>
        </div>
      </form>
      <h1
        className="col-span-full lg:col-span-10 lg:col-start-2 grid place-items-center w-full pt-2 place-self-start
            relative before:bg-primary-color before:absolute before:top-5 before:w-10 before:right-[38%]
            before:h-0.5 after:bg-primary-color after:absolute 
            after:top-5 after:w-10 after:left-[38%] after:h-0.5 max-xl:after:left-[33%] max-xl:before:right-[33%] -translate-x-2"
      >
        Hoặc
      </h1>
      <div className="col-span-full lg:col-span-8 xl:col-span-6 xl:col-start-4 lg:col-start-3 grid grid-flow-col place-content-center gap-6 pt-2">
        <Link href={GOOGLE_AUTH_URL}>
          <Button
            onClick={handleGoogleLogin}
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
          >
            <GoogleIcon /> Google
          </Button>
        </Link>
        <Link href={FACEBOOK_AUTH_URL}>
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
          >
            <FacebookIcon />
            Facebook
          </Button>
        </Link>
      </div>
      <div className="col-span-full text-sm text-center font-medium text-primary-color">
        <Link
          className="flex items-center justify-center"
          href="/forgot-password"
        >
          <h1
            className="hover:text-text-color transition-all duration-200 cursor-pointer
                        py-3 w-fit"
          >
            Quên mật khẩu?
          </h1>
        </Link>
        <p className="text-text-light-color flex justify-center items-center gap-x-2">
          Chưa có tài khoản?
          <Link href="/register">
            <span className="text-primary-color transition-all duration-200 hover:text-text-color cursor-pointer">
              Đăng ký ngay
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
