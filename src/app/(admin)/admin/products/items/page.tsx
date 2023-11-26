import { prefetchAllProducts } from "@/app/(user)/product/(detail)/[id]/page";
import { fetchAllCategories, fetchAllBrands } from "@/app/(user)/product/page";
import AdminProductItem from "@/container/admin/admin-product-item";
import React from "react";
import { fetchAllProductsByAdmin, fetchAllStyleValues } from "../page";
import { HTTP_PORT } from "@/app/page";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const fetchAllProductItems = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/productItems`, {
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
    throw new Error("Failed to fetch products data");
  }

  return res.json();
};

const ProductsItem = async () => {
  const res = await fetchAllProductItems();
  const productRes = await fetchAllProductsByAdmin(
    getCookie("accessToken", { cookies })!
  );
  const styleValuesRes = await fetchAllStyleValues();

  const productItem = res && res.success && res.result.content;
  const styleValue =
    styleValuesRes && styleValuesRes.success && styleValuesRes.result.content;
  const product = productRes && productRes.success && productRes.result.content;
  return (
    <AdminProductItem
      products={product}
      productItems={productItem}
      styleValues={styleValue}
    />
  );
};

export default ProductsItem;
