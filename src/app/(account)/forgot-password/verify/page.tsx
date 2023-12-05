import ResetPasswordForm from "@/container/profile/reset-password-form";
import React from "react";

export const revalidate = 3600; // revalidate every hour

const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
