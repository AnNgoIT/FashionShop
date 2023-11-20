import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getCookie } from "cookies-next";
import { fetchUserCredentials } from "../page";
import { cookies } from "next/headers";
import { UserInfo } from "@/features/types";
import { ReactNode } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
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
      : undefined;
  return (
    <>
      <Header userInfo={userInfo}></Header>
      {children}
      <Footer></Footer>
    </>
  );
};

export default UserLayout;
