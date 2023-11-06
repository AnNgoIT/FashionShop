"use client";
import dynamic from "next/dynamic";
import React from "react";

const RegisterForm = dynamic(() => import("@/container/account/register-form"));

const Register = () => {
  return <RegisterForm />;
};

export default Register;
