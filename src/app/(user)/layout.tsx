import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { fetchUserCredentials } from "../page";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

import CartHeader from "@/components/header/cart-header";

const CartLayout = async ({ children }: { children: ReactNode }) => {
  const accessToken = getCookie("accessToken", { cookies })!;

  const refreshToken = getCookie("refreshToken", { cookies })!;

  let userInfo = undefined,
    fullToken =
      accessToken && refreshToken
        ? {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        : undefined;

  const userCredentialsRes = await fetchUserCredentials(
    accessToken,
    refreshToken
  );

  const handleUserCredentialsResponse = async (res: any) => {
    if (accessToken) {
      userInfo = res?.success && {
        fullname: res.result.fullname,
        email: res.result.email,
        phone: res.result.phone,
        dob: res.result.dob,
        gender: res.result.gender,
        address: res.result.address,
        avatar: res.result.avatar,
        ewallet: res.result.ewallet,
        role: res.result.role,
      };
    } else {
      fullToken = res?.success && res.result;
      const newUserInfo = await fetchUserCredentials(
        fullToken?.accessToken!,
        fullToken?.refreshToken!
      );
      userInfo = newUserInfo?.success && {
        fullname: newUserInfo.result.fullname,
        email: newUserInfo.result.email,
        phone: newUserInfo.result.phone,
        dob: newUserInfo.result.dob,
        gender: newUserInfo.result.gender,
        address: newUserInfo.result.address,
        avatar: newUserInfo.result.avatar,
        ewallet: newUserInfo.result.ewallet,
        role: newUserInfo.result.role,
      };
    }
  };
  await handleUserCredentialsResponse(userCredentialsRes);

  return (
    <>
      <CartHeader userInfo={userInfo} fullToken={fullToken} />
      {children}
      <Footer />
    </>
  );
};

export default CartLayout;
