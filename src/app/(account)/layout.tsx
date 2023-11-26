import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { VerifyEmailProvider } from "@/store";
import { fetchUserCredentials, refreshLogin } from "../page";
import { cookies } from "next/headers";
import { getCookie, hasCookie } from "cookies-next";
import { Category, Product, UserInfo } from "@/features/types";
import { isTokenExpired } from "@/features/jwt-decode";
import { redirect } from "next/navigation";
import { prefetchAllProducts } from "../(user)/product/(detail)/[id]/page";
import { fetchAllCategories } from "../(user)/product/page";
import AccountHeader from "@/components/header/account-header";

const AccountLayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const productRes = await prefetchAllProducts();
  const cateRes = await fetchAllCategories();
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
        }
      : undefined;
  const products: Product[] =
    productRes && productRes.success && productRes.result.content;
  const categories: Category[] =
    cateRes && cateRes.success && cateRes.result.content;
  return (
    <>
      <VerifyEmailProvider>
        <AccountHeader
          userInfo={userInfo}
          fullToken={fullToken}
          products={products}
          categories={categories}
        />
        <main className="font-montserrat min-h-[40rem] py-12 bg-white  relative z-0">
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
