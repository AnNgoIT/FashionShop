import LoginForm from "@/container/account/login-form";
import React from "react";

export const revalidate = 1800; // revalidate every hour

const Login = () => {
  return <LoginForm></LoginForm>;
};

export default Login;
