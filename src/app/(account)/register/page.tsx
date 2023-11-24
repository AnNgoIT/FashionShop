import RegisterForm from "@/container/account/register-form";
import { VerifyEmailProvider } from "@/store";
import React from "react";

export const revalidate = 3600; // revalidate every hour

const Register = () => {
  return <RegisterForm />;
};

export default Register;
