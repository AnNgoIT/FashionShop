import { HTTP_PORT } from "@/app/page";
import ProductDetail from "@/container/product/detail";
import { Product } from "@/features/types";
import React from "react";
import { fetchAllCategories, prefetchAllProducts } from "../../page";
import { notFound } from "next/navigation";
// import dynamic from "next/dynamic";

// const ProductDetail = dynamic(() => import("@/container/product/detail"), {
//   ssr: false,
// });

export const dynamic = "force-dynamic";
export const dynamicParams = true; // true | false,

const fetchStyleVluesById = async (id: string, type: string) => {
  const res = await fetch(
    `${HTTP_PORT}/api/v1/products/styleValues/?productId=${id}&styleName=${type}`,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
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
  return res.json();
};

const fetchRelatedProducts = async (id: string) => {
  const res = await fetch(
    `${HTTP_PORT}/api/v1/products/${id}/related-products`,
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

  return res.json();
};

const fetchAllProductItemsByParentId = async (id: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/productItems/parent/${id}`, {
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
};
const fetchProductsById = async (id: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/products/${id}`, {
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

const fetchAllRatings = async (id: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/products/${id}/ratings`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      // cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      next: { revalidate: 100 },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json();
  } catch (error: any) {}
};

const fetchProductFollowCounts = async (id: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products/${id}/count-follows`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache",
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // next: { revalidate: 100 },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    );
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json();
  } catch (error: any) {}
};

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const [
    relatedRes,
    productItemRes,
    ratingRes,
    productDetailRes,
    colorsRes,
    sizesRes,
    followRes,
  ] = await Promise.all([
    fetchRelatedProducts(params.id),
    fetchAllProductItemsByParentId(params.id),
    fetchAllRatings(params.id),
    fetchProductsById(params.id),
    fetchStyleVluesById(params.id, "Color"),
    fetchStyleVluesById(params.id, "Size"),
    fetchProductFollowCounts(params.id),
  ]);

  if (
    !colorsRes.success ||
    !sizesRes.success ||
    !relatedRes.success ||
    !productItemRes.success ||
    !productDetailRes.success
  ) {
    notFound();
  }

  const color = colorsRes?.result?.content || [];
  const size = sizesRes?.result?.content || [];
  const rating = ratingRes?.result || [];
  const relatedProduct = relatedRes?.result || [];
  const productItem = productItemRes?.result?.content || [];
  const productDetail = productDetailRes?.result || {};
  const follows = followRes?.result || 0;
  return (
    <ProductDetail
      color={color}
      size={size}
      relatedProduct={relatedProduct}
      rating={rating}
      productItems={productItem}
      productDetail={productDetail}
      follows={follows}
    />
  );
};

export const generateStaticParams = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const res = await prefetchAllProducts();

  const products = res && res.success ? res.result.content : [];

  // Get the paths we want to pre-render based on products
  return products.map((product: Product) => ({
    params: {
      id: product.productId.toString(),
    },
  }));
};

export default ProductDetailPage;
