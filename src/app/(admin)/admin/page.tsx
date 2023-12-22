import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminDashBoard from "@/container/admin/admin-dashboard";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";
import { fetchAllProductsByAdmin } from "./products/page";
import { Product } from "@/features/types";

async function fetchAllOrdersAdmin(accessToken: string, refreshToken: string) {
  if (accessToken || refreshToken) {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/orders`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache",
      mode: "same-origin", // no-cors, *cors, same-origin
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
      else return undefined;
    }
    return res.json(); // parses JSON response into native JavaScript objects
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
}

async function fetchStatictics(
  url: string,
  accessToken: string,
  refreshToken: string
) {
  const res = await fetch(HTTP_PORT + url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache",
    mode: "same-origin", // no-cors, *cors, same-origin
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  if (res.status == 401) {
    const res2 = await refreshLogin(refreshToken);
    if (res2.success) return res2;
    else return undefined;
  }

  return res.json();
}

const AdminDashBoardPage = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;

  let fullToken =
      accessToken && refreshToken
        ? {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        : undefined,
    revenue = 0,
    newUser = 0;
  let refreshedOrders: any[] = [],
    refreshedProducts: Product[] = [];
  const [revenueRes, newUserRes, ordersRes, productRes] = await Promise.all([
    fetchStatictics(
      "/api/v1/users/admin/statistics/total-revenues",
      accessToken,
      refreshToken
    ),
    fetchStatictics(
      "/api/v1/users/admin/statistics/total-users",
      accessToken,
      refreshToken
    ),
    fetchAllOrdersAdmin(accessToken, refreshToken),
    fetchAllProductsByAdmin(accessToken, refreshToken),
  ]);
  const handleDashboardResponse = async (
    res: any,
    newUserRes: any,
    orderRes: any,
    productRes: any
  ) => {
    if (accessToken) {
      revenue = res?.success && res.result;
      newUser = newUserRes?.success && newUserRes.result;
      refreshedOrders = orderRes?.success && orderRes.result.content;
      refreshedProducts = productRes.success && productRes.result.content;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const [revenueRes, newUserRes, newOrdersRes, newProductRes] =
        await Promise.all([
          fetchStatictics(
            "/api/v1/users/admin/statistics/total-revenues",
            fullToken?.accessToken!,
            fullToken?.refreshToken!
          ),
          fetchStatictics(
            "/api/v1/users/admin/statistics/total-users",
            fullToken?.accessToken!,
            fullToken?.refreshToken!
          ),
          fetchAllOrdersAdmin(
            fullToken?.accessToken!,
            fullToken?.refreshToken!
          ),
          fetchAllProductsByAdmin(
            fullToken?.accessToken!,
            fullToken?.refreshToken!
          ),
        ]);
      revenue = revenueRes?.success && revenueRes.result;
      newUser = newUserRes?.success && newUserRes.result;
      refreshedOrders = newOrdersRes?.success && newOrdersRes.result.content;
      refreshedProducts = newProductRes.success && newProductRes.result.content;
    }
  };
  await handleDashboardResponse(revenueRes, newUserRes, ordersRes, productRes);
  return (
    <AdminDashBoard
      token={fullToken}
      revenues={revenue}
      newUsers={newUser}
      orders={refreshedOrders}
      products={refreshedProducts}
    />
  );
};

export default AdminDashBoardPage;
