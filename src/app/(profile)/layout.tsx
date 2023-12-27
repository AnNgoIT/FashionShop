import React, { ReactNode } from "react";

import Footer from "@/components/footer/footer";
import { fetchUserCredentials } from "../page";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

import AccountHeader from "@/components/header/account-header";

export const metadata = {
  title: "Profile",
};
const AccountLayout = async ({ children }: { children: ReactNode }) => {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;

  let userInfo = undefined,
    fullToken = undefined;

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
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
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
  // console.log("This is userInfo from root layout:", userInfo);
  return (
    <>
      <AccountHeader
        userInfo={userInfo}
        // userCart={cart}
        fullToken={fullToken}
      />
      <main className="font-montserrat py-12 bg-white relative z-0 overflow-hidden">
        <section className="container grid grid-cols-12 max-md:p-4 gap-x-2">
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AccountLayout;
