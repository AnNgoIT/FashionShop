"use client";
import dynamic from "next/dynamic";
import React from "react";

const ForgotPasswordForm = dynamic(
  () => import("@/container/account/forgot-password-form")
);

const Login = () => {
  return <ForgotPasswordForm></ForgotPasswordForm>;
};

export default Login;
