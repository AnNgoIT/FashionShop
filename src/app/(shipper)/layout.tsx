import React, { ReactNode } from "react";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { refreshLogin } from "@/app/page";
import ShipperLayout from "@/container/shipper/shipper-layout";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
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

  return <ShipperLayout token={fullToken}>{children}</ShipperLayout>;
};

export default AdminLayout;
