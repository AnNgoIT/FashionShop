import { fetchAllCategories, fetchAllBrands } from "@/app/(guest)/product/page";
import { HTTP_PORT } from "@/app/page";
import AdminProduct from "@/container/admin/admin-product";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const fetchAllStyleValues = async () => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/styleValues`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache",
      mode: "same-origin", // no-cors, *cors, same-origin
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

    return res.json();
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchAllProductsByAdmin = async (accessToken: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/products`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

const AdminProductPage = async () => {
  const res = await fetchAllProductsByAdmin(
    getCookie("accessToken", { cookies })!
  );
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
