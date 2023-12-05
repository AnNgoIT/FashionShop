import AdminProductItem from "@/container/admin/admin-product-item";
import React from "react";
import { fetchAllProductsByAdmin, fetchAllStyleValues } from "../page";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const ProductsItem = async () => {
  const productRes = await fetchAllProductsByAdmin(
    getCookie("accessToken", { cookies })!
  );
  const styleValuesRes = await fetchAllStyleValues();

  const styleValue =
    styleValuesRes && styleValuesRes.success && styleValuesRes.result.content;
  const product = productRes && productRes.success && productRes.result.content;
  return <AdminProductItem products={product} styleValues={styleValue} />;
};

export default ProductsItem;
