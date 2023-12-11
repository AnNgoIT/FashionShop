"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { hasCookie, deleteCookie } from "cookies-next";

const SuccessPayment = () => {
  useEffect(() => {
    return () => {
      if (hasCookie("isPayment")) deleteCookie("isPayment");
    };
  }, []);

  return (
    <div className="min-h-[600px] flex flex-col gap-y-5 items-center justify-center">
      <CheckCircleIcon sx={{ fontSize: "7rem", color: "green" }} />
      <h2 className="text-2xl font-semibold text-green-500">
        Thanh toán thành công
      </h2>
      <Link href="/">
        <button
          className="px-6 py-3 text-white hover:bg-text-color hover:cursor-pointer transition-colors
     rounded-4xl bg-green-500"
        >
          <span>Trở lại trang chủ</span>
        </button>
      </Link>
    </div>
  );
};

export default SuccessPayment;
