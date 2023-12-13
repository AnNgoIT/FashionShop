import { refreshLogin } from "@/app/page";
import AdminDashBoard from "@/container/admin/admin-dashboard";
import { hasCookie, getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";

const AdminDashBoardPage = async () => {
  let fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refershProducts = await refreshLogin(refreshToken);
    if (refershProducts.success) {
      fullToken = refershProducts.result;
    }
  }

  return <AdminDashBoard token={fullToken} />;
};

export default AdminDashBoardPage;
