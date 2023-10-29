"use client";
import { useRouter, usePathname } from "next/navigation";

const usePath = () => {
  const path = usePathname();
  const regex = /\[.*?\]/;
  const urlPath = path
    .split("/")
    .filter((value) => !regex.test(value))
    .map((value) => (value === "" ? "home" : value));
  return urlPath;
};

export default usePath;
