import { fetchAllBrands } from "@/app/(guest)/product/page";
import { refreshLogin } from "@/app/page";
import AdminBrand from "@/container/admin/admin-brand";
import { hasCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";

const BandsPage = async () => {
  const res = await fetchAllBrands();

  const brand = res && res.success && res.result.content;
  let fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refreshSession = await refreshLogin(refreshToken);
    if (refreshSession.success) {
      fullToken = refreshSession.result;
    } else fullToken = { accessToken: undefined, refreshToken: undefined };
  }
  return <AdminBrand token={fullToken} brands={brand} />;
};

export default BandsPage;
