import React, { useState } from "react";
import Link from "next/link";
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic ở đây
    // Ví dụ: gửi yêu cầu đến máy chủ

    // Reset trạng thái trường nhập liệu sau khi xử lý
    setEmail("");
  };

  return (
    <section className="container grid grid-cols-12 p-4 pb-24 mt-8 md:mt-12">
      <div
        className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-4 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10`}
      >
        <h2
          className="col-span-full text-xl leading-10 tracking-[0] text-text-color uppercase font-semibold mb-[30px] 
                        text-center"
        >
          forgot password
        </h2>
        <form
          className="col-span-full lg:col-span-10 lg:col-start-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
            <input
              placeholder="Enter your Email"
              className="bg-white outline-none w-full border border-[#e5e5e5]
                            py-[8px] px-[15px] text-[#999] min-h-[45px] leading-[28px] rounded-[5px]"
              type="text"
              id="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <Link href={"/forgot-password"}>
            <button
              className="bg-primary-color w-full transition-all duration-200 hover:bg-text-color py-[10px] 
                           float-right px-[20px] text-white rounded-[5px]"
              type="submit"
            >
              Send
            </button>
          </Link>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
