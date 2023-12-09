import AdminStyleValue from "@/container/admin/admin-style-value";
import React from "react";
import { fetchAllStyleValues } from "../products/page";
import { fetchAllStyles } from "../categories/page";
import { hasCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { refreshLogin } from "@/app/page";

const StyleValuePage = async () => {
  const [res, styleRes] = await Promise.all([
    fetchAllStyleValues(),
    fetchAllStyles(),
  ]);

  const styleValue = res?.success ? res.result.content : [];
  const style = styleRes?.success ? styleRes.result.content : [];

  let fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refreshSession = await refreshLogin(refreshToken);
    if (refreshSession.success) {
      fullToken = refreshSession.result;
    }
  }

  return (
    <AdminStyleValue
      token={fullToken}
      styleValues={styleValue}
      styles={style}
    />
  );
};

export default StyleValuePage;
