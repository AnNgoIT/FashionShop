import ForgotPasswordForm from "@/container/account/forgot-password-form";
import React from "react";

export const revalidate = 3600; // revalidate every hour

const Login = () => {
  return <ForgotPasswordForm></ForgotPasswordForm>;
};

export default Login;
