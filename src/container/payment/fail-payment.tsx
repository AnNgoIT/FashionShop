"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { deleteCookie, hasCookie } from "cookies-next";
const FailPayment = () => {
  useEffect(() => {
    return () => {
      if (hasCookie("isPayment")) deleteCookie("isPayment");
    };
  }, []);

  return (
    <div className="min-h-[600px] flex flex-col gap-y-5 items-center justify-center">
      <ErrorIcon sx={{ fontSize: "7rem", color: "red" }} />
      <h2 className="text-2xl font-semibold text-red-500">
        Thanh toán thất bại
      </h2>
      <Link href="/">
        <button
          className="px-6 py-3 text-white hover:bg-text-color hover:cursor-pointer transition-colors
 rounded-4xl bg-red-500"
        >
          <span>Trở lại trang chủ</span>
        </button>
      </Link>
    </div>
  );
};

export default FailPayment;
