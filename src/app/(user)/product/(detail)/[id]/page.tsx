import ProductDetail from "@/container/product/detail";
import { Product } from "@/features/types";
import { HTTP_PORT } from "@/hooks/useData";
import React from "react";

export const prefetchAllProducts = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/products`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch products data");
  }

  return res.json();
};

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <ProductDetail
      params={{
        id: params.id,
      }}
    />
  );
};

export default ProductDetailPage;

export async function generateStaticParams() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const res = await prefetchAllProducts();

  const products = res && res.success ? res.result.content : {};

  // Get the paths we want to pre-render based on products
  return products.map((product: Product) => ({
    params: { id: product.productId.toString() },
  }));
}
