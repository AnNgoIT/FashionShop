import { fetchAllCategories } from "@/app/(guest)/product/page";
import { HTTP_PORT } from "@/app/page";
import AdminCategory from "@/container/admin/admin-category";
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

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch style data");
    }

    return res.json();
  } catch (error: any) {}
};
const AdminCategoryPage = async () => {
  const res = await fetchAllCategories();
  const styleRes = await fetchAllStyles();
  const category = res && res.success && res.result.content;
  const style = styleRes && styleRes.success && styleRes.result.content;

  return <AdminCategory categories={category} styles={style}></AdminCategory>;
};

export default AdminCategoryPage;
