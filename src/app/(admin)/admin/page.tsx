import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminDashBoard from "@/container/admin/admin-dashboard";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";

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
            accessToken,
            refreshToken,
          }
        : undefined,
    revenue = 0,
    newUser = 0;
  const [revenueRes, newUserRes] = await Promise.all([
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
  ]);
  const handleDashboardResponse = async (res: any, newUserRes: any) => {
    if (accessToken) {
      revenue = res?.success && res.result;
      newUser = newUserRes?.success && newUserRes.result;
    } else {
      fullToken = res?.success && res.result;
      const [revenueRes, newUserRes] = await Promise.all([
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
      ]);
      revenue = revenueRes?.success && revenueRes.result;
      newUser = newUserRes?.success && newUserRes.result;
    }
  };
  await handleDashboardResponse(revenueRes, newUserRes);

  return (
    <AdminDashBoard token={fullToken} revenues={revenue} newUsers={newUser} />
  );
};

export default AdminDashBoardPage;
