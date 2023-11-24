import MainProduct from "@/container/product/main-product";
import { Brand, Category, Product, StyleValue } from "@/features/types";
import { prefetchAllProducts } from "./(detail)/[id]/page";
import { HTTP_PORT } from "@/app/page";

export const fetchAllCategories = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/categories`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    next: {
      revalidate: 3600,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch categories data");
  }

  return res.json();
};

export const fetchAllBrands = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/brands`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    next: {
      revalidate: 3600,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch categories data");
  }

  return res.json();
};

const ProductPage = async () => {
  const cateRes = await fetchAllCategories();
  const brandRes = await fetchAllBrands();
  const productRes = await prefetchAllProducts();
  const categories: Category[] =
    cateRes && cateRes.success ? cateRes.result.content : {};

  const brands: Brand[] =
    brandRes && brandRes.success ? brandRes.result.content : {};

  const products: Product[] =
    productRes && productRes.success ? productRes.result.content : {};

  return (
    <MainProduct categories={categories} brands={brands} products={products} />
  );
};

export default ProductPage;
