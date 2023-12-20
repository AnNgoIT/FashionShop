"use client";
import { deleteUnverifyEmail, verifyOTP } from "@/hooks/useAuth";
import { VerifyEmailContext } from "@/store";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { redirect, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const OTPForm = () => {
  const router = useRouter();
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const { verifyEmail, setVerifyEmail } = useContext(VerifyEmailContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVerifyEmail({ email: "" });
    }, 120000);

    return () => {
      clearTimeout(timeout); // Clear timeout trước khi gọi API
      // Gọi API để xóa dữ liệu không còn cần thiết khi component unmount
      deleteUnverifyEmail(verifyEmail.email)
        .then((res) => res.json())
        .catch((error) => console.log(error));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Đảm bảo sử dụng dependency để clean-up được gọi khi verifyEmail.email thay đổi

  // Kiểm tra điều kiện trước khi render
  if (verifyEmail.email === "") {
    redirect("/register");
  }

  const handleVerifyEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic ở đây
    // Ví dụ: gửi yêu cầu đến máy chủ
    const id = toast.loading("Đang xác nhận...");
    const response = await verifyOTP({
      email: verifyEmail.email,
      otp: otp.trim(),
    });
    if (response.success) {
      toast.update(id, {
        render: `Xác nhận thành công`,
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      toast.update(id, {
        render: `Sai OTP`,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
      setError("Sai OTP");
    }
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
        Xác nhận email
      </h2>
      <form
        className="col-span-full lg:col-span-10 lg:col-start-2"
        onSubmit={handleVerifyEmail}
      >
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={error != ""}>
            <InputLabel htmlFor="otp">Mã OTP</InputLabel>
            <OutlinedInput
              type="number"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              id="otp"
              autoComplete="off"
              name="otp"
              label="OTP Code"
              aria-describedby="otp"
            />
            <FormHelperText id="otp-error">{error}</FormHelperText>
          </FormControl>
        </div>
        <button
          className="bg-primary-color w-full transition-all duration-200 hover:bg-text-color py-[10px] 
                       float-right px-[20px] text-white rounded-[5px]"
          type="submit"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
};

export default OTPForm;
