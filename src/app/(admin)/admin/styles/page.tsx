import AdminStyle from "@/container/admin/admin-style";
import React from "react";
import { fetchAllStyles } from "../categories/page";
import { hasCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { refreshLogin } from "@/app/page";

const StylesPage = async () => {
  const res = await fetchAllStyles();
  const style = res && res.success && res.result.content;
  
  let fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refershToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refreshSession = await refreshLogin(refreshToken);
    if (refreshSession.success) {
      fullToken = refreshSession.result;
    }
  }
  return <AdminStyle token={fullToken} styles={style} />;
};

export default StylesPage;
