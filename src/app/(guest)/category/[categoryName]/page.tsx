import React from "react";
import { Category } from "@/features/types";
import { HTTP_PORT } from "@/app/page";
import { ProductByCate } from "@/container/product/product-by-cate";
import { fetchAllCategories } from "../../product/page";

// const ProductByCate = dynamic(() => import("@/container/product/product-by-cate"), {
//   ssr: false,
// });

export const dynamic = "force-dynamic";
export const dynamicParams = true; // true | false,

const fetchAllProductByCategoryName = async (categoryName: string) => {
  try {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/products?categoryName=${categoryName}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "force-cache",
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

const ProductByCategoryPage = async ({
  params,
}: {
  params: { categoryName: string };
}) => {
  const res = await fetchAllProductByCategoryName(params.categoryName);

  // if (res) {
  //   notFound();
  // }
  const product = res && res.success && res.result.content;

  return <ProductByCate productsByCate={product} />;
};

export const generateStaticParams = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const res = await fetchAllCategories();

  const categories = res?.success ? res.result.content : [];

  // Get the paths we want to pre-render based on categories
  return categories.map((category: Category) => ({
    params: {
      categoryName: category.name,
    },
  }));
};

export default ProductByCategoryPage;
