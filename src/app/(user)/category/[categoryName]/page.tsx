import React from "react";
import { prefetchAllProducts } from "../../product/(detail)/[id]/page";
import { Product } from "@/features/types";
import { HTTP_PORT } from "@/app/page";
import { ProductByCate } from "@/container/product/product-by-cate";

export const fetchAllProductByCategoryName = async (categoryName: string) => {
  const res = await fetch(
    `${HTTP_PORT}/api/v1/products?categoryName=${categoryName}`,
    {
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
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch product by category name data");
  }

  return res.json();
};

const ProductByCategoryPage = async ({
  params,
}: {
  params: { categoryName: string };
}) => {
  const res = await fetchAllProductByCategoryName(params.categoryName);
  const product = res && res.success && res.result.content;
  return <ProductByCate productsByCate={product} />;
};

export default ProductByCategoryPage;

export async function generateStaticParams() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const res = await prefetchAllProducts();

  const products = res && res.success ? res.result.content : {};

  // Get the paths we want to pre-render based on products
  return products.map((product: Product) => ({
    params: { categoryName: product.categoryName },
  }));
}
