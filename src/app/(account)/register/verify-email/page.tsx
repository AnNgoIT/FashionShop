import OTPForm from "@/container/account/otp-form";
import React from "react";

export const revalidate = 3600; // revalidate every hour

const VerifyEmailForm = () => {
  return <OTPForm />;
};

export default VerifyEmailForm;
