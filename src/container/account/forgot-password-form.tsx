"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Xử lý logic ở đây
    // Ví dụ: gửi yêu cầu đến máy chủ
    const id = toast.loading("Please wait...");
    const res = await forgotPassword({ email: email });
    if (res.success) {
      setVerifyEmail({
        email: email,
      });
      toast.update(id, {
        render: `A verify email sent to ${email}`,
        type: "success",
        autoClose: 2000,
        isLoading: false,
      });
      router.push("/forgot-password/verify");
    } else if (res.statusCode == 404) {
      toast.update(id, {
        render: `This email is not registered`,
        type: "success",
        autoClose: 1500,
        isLoading: false,
      });
      setError(`This email is not registered`);
    }
    // Reset trạng thái trường nhập liệu sau khi xử lý
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
        forgot password
      </h2>
      <form
        className="col-span-full lg:col-span-10 lg:col-start-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col text-sm text-[#999] font-medium mb-[29px]">
          <FormControl fullWidth error={error != ""}>
            <InputLabel htmlFor="email">Enter your Email</InputLabel>
            <OutlinedInput
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              label="Enter your Email"
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
          Send
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
