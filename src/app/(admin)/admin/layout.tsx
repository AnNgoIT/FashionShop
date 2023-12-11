import Dashboard from "@/components/dashboard/Dashboard";

import React, { ReactNode } from "react";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { refreshLogin } from "@/app/page";

// export const runtime = "edge"; // 'nodejs' (default) | 'edge'

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

  return <Dashboard token={fullToken}>{children}</Dashboard>;
};

export default AdminLayout;
