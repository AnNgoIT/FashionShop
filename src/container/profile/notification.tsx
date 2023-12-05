"use client";
import React from "react";

const NotificationComponent = () => {
  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
  bg-white p-5 max-lg:px-10 rounded-sm mb-8 h-fit`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center pb-4 border-b-[0] lg:border-b border-border-color">
        Thông báo
      </h2>
      <div className="col-span-full lg:col-span-3 xl:col-span-5 min-w-max max-lg:order-1 mt-4">
        Đây là trang thông báo
      </div>
    </div>
  );
};

export default NotificationComponent;
