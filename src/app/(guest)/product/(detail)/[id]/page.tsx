import { HTTP_PORT } from "@/app/page";
import ProductDetail from "@/container/product/detail";
import { Product, StyleValue, productItem } from "@/features/types";
import React from "react";
import { prefetchAllProducts } from "../../page";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true; // true | false,

const fetchStyleVlueColorsById = async (productId: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products/styleValues/?productId=${productId}&styleName=Color`,
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
  } catch (error) {
    console.log(error);
  }
};

const fetchStyleVlueSizesById = async (productId: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products/styleValues/?productId=${productId}&styleName=Size`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache",
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    );
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const fetchRelatedProducts = async (productId: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products/${productId}/related-products`,
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
  } catch (error: any) {
    console.log(error);
  }
};

const fetchAllProductItemsByParentId = async (productId: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/productItems/parent/${productId}`,
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
  } catch (error: any) {
    console.log(error);
  }
};
const fetchProductsById = async (productId: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/products/${productId}`, {
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
  } catch (error: any) {
    console.log(error);
  }
};

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const colorsRes = await fetchStyleVlueColorsById(params.id);
  const sizesRes = await fetchStyleVlueSizesById(params.id);
  const relatedRes = await fetchRelatedProducts(params.id);
  const productItemRes = await fetchAllProductItemsByParentId(params.id);
  const productDetailRes = await fetchProductsById(params.id);
  if (
    !productItemRes.success ||
    !colorsRes.success ||
    !sizesRes.success ||
    !relatedRes.success ||
    !productDetailRes.success
  ) {
    notFound();
  }

  const color: StyleValue[] =
    colorsRes && colorsRes.success && colorsRes.result.content;
  const size: StyleValue[] =
    sizesRes && sizesRes.success && sizesRes.result.content;

  const relatedProduct: Product[] =
    relatedRes && relatedRes.success && relatedRes.result.content;
  const productItem: productItem[] =
    productItemRes && productItemRes.success && productItemRes.result.content;

  const productDetail: Product =
    productDetailRes && productDetailRes.success && productDetailRes.result;

  return (
    <ProductDetail
      productId={params.id}
      color={color}
      size={size}
      relatedProduct={relatedProduct}
      productItems={productItem}
      productDetail={productDetail}
    />
  );
};

export async function generateStaticParams() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const res = await prefetchAllProducts();

  const products = res && res.success ? res.result.content : [];

  // Get the paths we want to pre-render based on products
  return products.map((product: Product) => ({
    params: {
      id: product.productId.toString(),
    },
  }));
}

export default ProductDetailPage;
