import { fetchAllCategories, fetchAllBrands } from "@/app/(guest)/product/page";
import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminProduct from "@/container/admin/admin-product";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

// const AdminProduct = dynamic(() => import("@/container/admin/admin-product"), {
//   ssr: false,
//   loading: () => <LoadingComponent />,
// });
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
};
const AdminProductPage = async () => {
  const [
    productsResponse,
    categoriesResponse,
    brandsResponse,
    styleValuesResponse,
  ] = await Promise.all([
    fetchAllProductsByAdmin(getCookie("accessToken", { cookies })!),
    fetchAllCategories(),
    fetchAllBrands(),
    fetchAllStyleValues(),
  ]);
  let refreshedProducts = [],
    fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refershProducts = await refreshLogin(refreshToken);
    if (refershProducts.success) {
      fullToken = refershProducts.result;
      const newProducts = await fetchAllProductsByAdmin(
        refershProducts.result.accessToken
      );
      if (newProducts.success) {
        refreshedProducts = newProducts.result.content;
      }
    } else fullToken = { accessToken: undefined, refreshToken: undefined };
  }

  const product = productsResponse?.success
    ? productsResponse.result.content
    : refreshedProducts;

  const category = categoriesResponse?.success
    ? categoriesResponse.result.content
    : [];
  const brand = brandsResponse?.success ? brandsResponse.result.content : [];
  const styleValue = styleValuesResponse?.success
    ? styleValuesResponse.result.content
    : [];

  // Tiếp tục xử lý dữ liệu ở đây

  return (
    <AdminProduct
      token={fullToken}
      products={product}
      categories={category}
      brands={brand}
      styleValues={styleValue}
    />
  );
};

export default AdminProductPage;
