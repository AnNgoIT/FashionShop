"use client";

import { useRouter } from "next/navigation";
import React, { MouseEventHandler } from "react";

const sizes: {
  [properties: string]: string;
} = {
  md: "px-4 py-2 rounded-md text-base",
  lg: "px-5 py-3 rounded-lg text-lg",
};

const colors: {
  [properties: string]: string;
} = {
  indigo: "bg-indigo-500 hover:bg-indigo-600 text-white",
  cyan: "bg-cyan-600 hover:bg-cyan-700 text-white",
};

const Button = ({
  color,
  size,
  children,
  onclick,
}: {
  color: string;
  size: string;
  children: any;
  onclick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  let colorClasses = colors[color];
  let sizeClasses = sizes[size];
  const router = useRouter();

  return (
    <button
      type="button"
      className={`font-bold ${sizeClasses} ${colorClasses} col-span-full`}
      onClick={onclick ? onclick : router.back}
    >
      {children}
    </button>
  );
};

export default Button;
