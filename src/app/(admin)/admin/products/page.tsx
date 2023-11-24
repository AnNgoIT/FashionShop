import { prefetchAllProducts } from "@/app/(user)/product/(detail)/[id]/page";
import { fetchAllBrands, fetchAllCategories } from "@/app/(user)/product/page";
import { HTTP_PORT } from "@/app/page";
import AdminProduct from "@/container/admin/admin-product";

export const fetchAllStyleValues = async () => {
  const res = await fetch(`${HTTP_PORT}/api/v1/styleValues`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 3600,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch categories data");
  }

  return res.json();
};

const AdminProductPage = async () => {
  const res = await prefetchAllProducts();
  const cateRes = await fetchAllCategories();
  const brandRes = await fetchAllBrands();
  const styleValuesRes = await fetchAllStyleValues();
  const product = res && res.success && res.result.content;
  const category = cateRes && cateRes.success && cateRes.result.content;
  const brand = brandRes && brandRes.success && brandRes.result.content;
  const styleValue =
    styleValuesRes && styleValuesRes.success && styleValuesRes.result.content;

  return (
    <AdminProduct
      products={product}
      categories={category}
      brands={brand}
      styleValues={styleValue}
    />
  );
};

export default AdminProductPage;
