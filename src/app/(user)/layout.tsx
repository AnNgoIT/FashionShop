import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { fetchUserCredentials, refreshLogin } from "../page";
import { cookies } from "next/headers";
import { getCookie, hasCookie } from "cookies-next";

import CartHeader from "@/components/header/cart-header";
import { userCart } from "./cart/page";

const CartLayout = async ({ children }: { children: ReactNode }) => {
  const [userCredentialsRes, userCartRes] = await Promise.all([
    fetchUserCredentials(getCookie("accessToken", { cookies })!),
    userCart(getCookie("accessToken", { cookies })!),
  ]);

  let userInfo = undefined,
    cart = undefined,
    fullToken = undefined;

  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      fullToken = refresh.result;
      const [res, res2] = await Promise.all([
        fetchUserCredentials(refresh.result.accessToken),
        userCart(refresh.result.accessToken),
      ]);
      userInfo = res.success
        ? {
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
        : undefined;
      cart = res2.success ? res2.result.cartItems : undefined;
    }
  } else {
    userInfo = userCredentialsRes.success
      ? {
          fullname: userCredentialsRes.result.fullname,
          email: userCredentialsRes.result.email,
          phone: userCredentialsRes.result.phone,
          dob: userCredentialsRes.result.dob,
          gender: userCredentialsRes.result.gender,
          address: userCredentialsRes.result.address,
          avatar: userCredentialsRes.result.avatar,
          ewallet: userCredentialsRes.result.ewallet,
          role: userCredentialsRes.result.role,
        }
      : undefined;
    cart = userCartRes.success ? userCartRes.result.cartItems : undefined;
  }
  return (
    <>
      <CartHeader userInfo={userInfo} fullToken={fullToken} userCart={cart} />
      {children}
      <Footer />
    </>
  );
};

export default CartLayout;
