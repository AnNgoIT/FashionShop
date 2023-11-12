"use client";

// import LoginForm from "@/container/user/login-form";
import dynamic from "next/dynamic";
import React from "react";

const LoginForm = dynamic(() => import("@/container/account/login-form"));
const Login = () => {
  return <LoginForm></LoginForm>;
};

export default Login;
