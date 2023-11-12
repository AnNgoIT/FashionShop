import React, { useState } from "react";
import Link from "next/link";
import NavigateButton from "@/components/button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Button from "@mui/material/Button";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
    // Ví dụ: gửi yêu cầu đăng nhập đến máy chủ

    // Reset trạng thái trường nhập liệu sau khi xử lý
    setUsername("");
    setPassword("");
  };

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10 rounded-md`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold mb-6 text-center">
        CUSTOMER LOGIN
      </h2>
      <form
        className="col-span-full lg:col-span-10 lg:col-start-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
          <label className="text-text-color mb-2" htmlFor="username">
            Username :
          </label>
          <input
            placeholder="Enter your Email"
            className="bg-white outline-none w-full border border-border-color
                            py-2 px-4 text-text-light-color min-h-[3rem] rounded-md"
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
          <label className="text-text-color mb-2" htmlFor="password">
            Password :
          </label>
          <input
            placeholder="Enter your password"
            className="bg-white outline-none w-full border border-border-color
                            py-2 px-4 text-text-light-color min-h-[3rem] rounded-md"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="flex items-center text-sm text-text-light-color font-medium">
          <input
            className="py-2 px-4 bg-[#f8f8f8] mr-1 min-h-[1.125rem] min-w-[1.125rem]"
            type="checkbox"
            id="rememberAccount"
          />
          <label className="text-text-light-color" htmlFor="rememberAccount">
            Remember Me
          </label>
        </div>
        <div className="h-fit float-right">
          <NavigateButton>Log In</NavigateButton>
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
