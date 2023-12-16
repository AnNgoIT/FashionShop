import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getCookie } from "cookies-next";
import { fetchUserCredentials } from "../page";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { fetchAllCategories, prefetchAllProducts } from "./product/page";

const GuestLayout = async ({ children }: { children: ReactNode }) => {
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

  const [userCredentialsRes, cateRes, productsRes] = await Promise.all([
    fetchUserCredentials(accessToken, refreshToken),
    fetchAllCategories(),
    prefetchAllProducts(),
  ]);

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

  const products = productsRes?.success ? productsRes.result.content : [];
  const categories = cateRes?.success ? cateRes.result.content : [];

  return (
    <>
      <Header
        userInfo={userInfo}
        products={products}
        fullToken={fullToken}
        categories={categories}
      />
      {children}
      <Footer />
    </>
  );
};

export default GuestLayout;
