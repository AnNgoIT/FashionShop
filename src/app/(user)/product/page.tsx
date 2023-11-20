import MainProduct from "@/container/product/main-product";
import { Brand, Category, Product, StyleValue } from "@/features/types";
import { HTTP_PORT } from "@/hooks/useData";
import { prefetchAllProducts } from "./(detail)/[id]/page";

const fetchAllCategories = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/categories`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch categories data");
  }

  return res.json();
};

const fetchAllBrands = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/brands`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch categories data");
  }

  return res.json();
};

const fetchAllStyleValues = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/styleValues`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch stylevalues data");
  }

  return res.json();
};

const ProductPage = async () => {
  const cateRes = await fetchAllCategories();
  const brandRes = await fetchAllBrands();
  const productRes = await prefetchAllProducts();
  const styleValueRes = await fetchAllStyleValues();

  const categories: Category[] =
    cateRes && cateRes.success ? cateRes.result.content : {};

  const brands: Brand[] =
    brandRes && brandRes.success ? brandRes.result.content : {};

  const products: Product[] =
    productRes && productRes.success ? productRes.result.content : {};

  const styleValues: StyleValue[] =
    styleValueRes && styleValueRes.success ? styleValueRes.result.content : {};

  return (
    <MainProduct
      categories={categories}
      brands={brands}
      products={products}
      styleValues={styleValues}
    />
  );
};

export default ProductPage;
