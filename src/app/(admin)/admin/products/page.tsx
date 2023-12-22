import { fetchAllCategories, fetchAllBrands } from "@/app/(guest)/product/page";
import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminProduct from "@/container/admin/admin-product";
import { Product } from "@/features/types";
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

export const fetchAllProductsByAdmin = async (
  accessToken: string,
  refreshToken: string
) => {
  if (accessToken || refreshToken) {
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
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
      else return undefined;
    }
    return res.json();
  }
};
const AdminProductPage = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;
  const [
    productsResponse,
    categoriesResponse,
    brandsResponse,
    styleValuesResponse,
  ] = await Promise.all([
    fetchAllProductsByAdmin(accessToken, refreshToken),
    fetchAllCategories(),
    fetchAllBrands(),
    fetchAllStyleValues(),
  ]);
  let refreshedProducts: Product[] = [],
    fullToken = undefined;

  const handleProductResponse = async (res: any) => {
    if (accessToken) {
      refreshedProducts = res.success && res.result.content;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const res2 = await fetchAllProductsByAdmin(
        fullToken.accessToken,
        fullToken.refreshToken
      );
      refreshedProducts = res2.success ? res2.result.content : [];
    }
  };

  await handleProductResponse(productsResponse);
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
      products={refreshedProducts}
      categories={category}
      brands={brand}
      styleValues={styleValue}
    />
  );
};

export default AdminProductPage;
