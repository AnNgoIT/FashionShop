import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { VerifyEmailProvider } from "@/store";
import { fetchUserCredentials, refreshLogin } from "../page";
import { cookies } from "next/headers";
import { getCookie, hasCookie } from "cookies-next";
import { Product, UserInfo } from "@/features/types";
import { isTokenExpired } from "@/features/jwt-decode";
import { redirect } from "next/navigation";

import { prefetchAllProducts } from "../(guest)/product/(detail)/[id]/page";
import CartHeader from "@/components/header/cart-header";

const CartLayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const productRes = await prefetchAllProducts();
  let result = null,
    fullToken;
  if (res.statusCode == 401) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      if (isTokenExpired(refreshToken)) {
        redirect("/login");
      }
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res2 = await fetchUserCredentials(refresh.result.accessToken);
        result = res2;
      } else redirect("/login");
    }
  }
  let info: UserInfo = {
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: null,
    ewallet: null,
    role: "",
  };
  const userInfo: UserInfo | undefined =
    res && res.success
      ? {
          ...info,
          fullname: res.result.fullname,
          email: res.result.email,
          phone: res.result.phone,
          dob: res.result.dob,
          gender: res.result.gender,
          address: res.result.address,
          avatar: res.result.avatar,
          ewallet: res.result.ewallet,
          role: res.result.role,
        }
      : result && result.success
      ? {
          ...info,
          fullname: result.result.fullname,
          email: result.result.email,
          phone: result.result.phone,
          dob: result.result.dob,
          gender: result.result.gender,
          address: result.result.address,
          avatar: result.result.avatar,
          ewallet: result.result.ewallet,
          role: res.result.role,
        }
      : undefined;

  return (
    <>
      <CartHeader userInfo={userInfo} fullToken={fullToken} />
      {children}
      <Footer />
    </>
  );
};

export default CartLayout;
