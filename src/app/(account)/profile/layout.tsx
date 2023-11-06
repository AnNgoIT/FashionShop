"use client";
import ProfileNav from "@/container/profile/left-nav";
import React, { ReactNode } from "react";

const Profilelayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ProfileNav />
      {children}
    </>
  );
};

export default Profilelayout;
