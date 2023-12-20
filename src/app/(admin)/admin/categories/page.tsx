import { fetchAllCategories } from "@/app/(guest)/product/page";
import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminCategory from "@/container/admin/admin-category";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import React from "react";

export const fetchAllStyles = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/styles`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json();
  } catch (error: any) {}
};

export const fetchAllAdminCategories = async (accessToken: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/categories`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json();
  } catch (error: any) {}
};

const AdminCategoryPage = async () => {
  const [res, styleRes] = await Promise.all([
    fetchAllAdminCategories(getCookie("accessToken", { cookies })!),
    fetchAllStyles(),
  ]);

  let fullToken = undefined,
    refreshCategories = [];
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refreshSession = await refreshLogin(refreshToken);
    if (refreshSession.success) {
      fullToken = refreshSession.result;
      const newCategories = await fetchAllAdminCategories(
        fullToken.accessToken
      );
      if (newCategories.success)
        refreshCategories = newCategories.result.content;
    } else fullToken = { accessToken: undefined, refreshToken: undefined };
  }

  const category = res?.success ? res.result.content : refreshCategories;
  const style = styleRes?.success ? styleRes.result.content : [];
  return (
    <AdminCategory
      token={fullToken}
      categories={category}
      styles={style}
    ></AdminCategory>
  );
};

export default AdminCategoryPage;
