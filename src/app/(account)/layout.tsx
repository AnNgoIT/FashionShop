import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { VerifyEmailProvider } from "@/store";
import { fetchUserCredentials, refreshLogin } from "../page";
import { cookies } from "next/headers";
import { getCookie, hasCookie } from "cookies-next";
import { Product, UserInfo } from "@/features/types";

import AccountHeader from "@/components/header/account-header";
import { userCart } from "../(user)/cart/page";
import { prefetchAllProducts } from "../(guest)/product/page";

const AccountLayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const cartRes = await userCart(getCookie("accessToken", { cookies })!);
  let result = undefined,
    fullToken = undefined;
  if (res.statusCode == 401) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res2 = await fetchUserCredentials(refresh.result.accessToken);
        result = res2;
      }
    }
  }
  const userInfo: UserInfo | undefined =
    res && res.success
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
      : result && result.success
      ? {
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

  const productRes = await prefetchAllProducts();
  const products: Product[] =
    productRes && productRes.success && productRes.result.content;
  const cart = cartRes && cartRes.success && cartRes.result.cartItems;

  return (
    <>
      <VerifyEmailProvider>
        <AccountHeader
          userInfo={userInfo}
          userCart={cart}
          fullToken={fullToken}
          products={products}
        />
        <main className="font-montserrat py-12 bg-white relative z-0 overflow-hidden">
          <section className="container grid grid-cols-12 max-md:p-4 gap-x-2">
            {children}
          </section>
        </main>
        <Footer />
      </VerifyEmailProvider>
    </>
  );
};

export default AccountLayout;
