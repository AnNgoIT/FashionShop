"use client";
import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { forgotPassword } from "@/hooks/useAuth";
import FormHelperText from "@mui/material/FormHelperText";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { VerifyEmailContext } from "@/store";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const { setVerifyEmail } = useContext(VerifyEmailContext);

  const handleEmail = (e: any) => {
    const value = e.target.value.trim();
    setEmail(value.trim());
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic ở đây
    // Ví dụ: gửi yêu cầu đến máy chủ
    const id = toast.loading("Vui lòng đợi...");
    const res = await forgotPassword({ email: email });
    if (res.success) {
      setVerifyEmail({
        email: email,
      });
      toast.update(id, {
        render: `Một tin xác nhận đã được gửi tới email ${email}`,
        type: "success",
        autoClose: 2000,
        isLoading: false,
      });
      router.push("/forgot-password/verify");
    } else if (res.statusCode == 400) {
      toast.update(id, {
        render: `Email phải đúng định dạng @*.*`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
      setError(`Email phải đúng định dạng @*.*`);
    } else if (res.statusCode == 404) {
      toast.update(id, {
        render: `Tài khoản này chưa được đăng ký`,
        type: "error",
        autoClose: 1500,
        isLoading: false,
      });
      setError(`Tài khoản này chưa được đăng ký`);
    }
    // Reset trạng thái trường nhập liệu sau khi xử lý
  };

  return (
    <div
      className={`col-span-full md:col-span-10 md:col-start-2 lg:col-span-4 lg:col-start-5 grid grid-cols-12 gap-x-8 shadow-hd
         bg-white py-5 max-lg:px-10 min-h-[40px]`}
    >
      <h2
        className="col-span-full text-xl leading-10 tracking-[0] text-text-color uppercase font-semibold mb-[30px] 
                        text-center"
      >
        quên mật khẩu
      </h2>
      <form
        className="col-span-full lg:col-span-10 lg:col-start-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={error != ""}>
            <InputLabel htmlFor="email">Nhập email của bạn</InputLabel>
            <OutlinedInput
              type="text"
              value={email}
              required
              onChange={handleEmail}
              id="email"
              name="email"
              label="Nhập email của bạn"
              autoComplete="off"
              aria-describedby="email"
            />
          </FormControl>
          <FormHelperText id="fullname-error">{error}</FormHelperText>
        </div>
        <button
          className="bg-primary-color w-full transition-all duration-200 hover:bg-text-color py-[10px] 
                           float-right px-[20px] text-white rounded-[5px]"
          type="submit"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
