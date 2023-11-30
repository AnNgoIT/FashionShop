import MainProduct from "@/container/product/main-product";
import { Brand, Category, Product } from "@/features/types";
import { prefetchAllProducts } from "./(detail)/[id]/page";
import { HTTP_PORT } from "@/app/page";

export const fetchAllCategories = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/categories`, {
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

export const fetchAllBrands = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/brands`, {
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
