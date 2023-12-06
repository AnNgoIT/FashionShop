import { fetchUserCredentials } from "@/app/page";
import ProfileNav from "@/container/profile/left-nav";
import { UserInfo } from "@/features/types";
import { refreshLogin } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import React, { ReactNode } from "react";

const Profilelayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );

  let result = undefined,
    fullToken = undefined;
  if (res.statusCode == 401) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res = await fetchUserCredentials(refresh.result.accessToken);
        result = res;
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

  return (
    <>
      <ProfileNav info={userInfo} />
      {children}
    </>
  );
};

export default Profilelayout;
