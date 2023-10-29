import React, { useState } from "react";
import Link from "next/link";
const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic đăng nhập ở đây
    // Ví dụ: gửi yêu cầu đăng nhập đến máy chủ

    // Reset trạng thái trường nhập liệu sau khi xử lý
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="container grid grid-cols-12 py-4 max-md:px-4 pb-24 mt-8">
      <div
        className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10 rounded-md`}
      >
        <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold mb-6 text-center">
          create account
        </h2>
        <form
          className="col-span-full lg:col-span-10 lg:col-start-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
            <label className="text-[#333] mb-2" htmlFor="username">
              Username :
            </label>
            <input
              placeholder="Enter your Email / Username"
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
            <label className="text-[#333] mb-2" htmlFor="password">
              Password :
            </label>
            <input
              placeholder="Enter your Password"
              className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="flex flex-col text-sm text-text-light-color font-medium mb-7">
            <label className="text-[#333] mb-2" htmlFor="confirmPassword">
              Confirm Password :
            </label>
            <input
              placeholder="Confirm your Password"
              className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
              type="text"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <Link href={"/register"}>
            <button
              className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[18px] 
                           float-right px-[26px] text-white rounded-[5px]"
              type="submit"
            >
              Register
            </button>
          </Link>
        </form>
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
    </section>
  );
};

export default RegisterForm;
