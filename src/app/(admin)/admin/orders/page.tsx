import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminOrders from "@/container/admin/admin-order";
import { orderItem } from "@/features/types";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function fetchAllOrdersAdmin(accessToken: string) {
  const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/orders`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache",
    mode: "same-origin", // no-cors, *cors, same-origin
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

  return res.json(); // parses JSON response into native JavaScript objects
}

export default async function AdminOrderPage() {
  const accessToken = getCookie("accessToken", { cookies }) || "";

  const res = await fetchAllOrdersAdmin(accessToken);

  let refreshedOrders = [],
    fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refershProducts = await refreshLogin(refreshToken);
    if (refershProducts.success) {
      fullToken = refershProducts.result;
      const newProducts = await fetchAllOrdersAdmin(
        refershProducts.result.accessToken
      );
      if (newProducts.success) {
        refreshedOrders = newProducts.result.content;
      }
    }
  }

  const order = res?.success
    ? (res.result.content as orderItem[])
    : refreshedOrders;
  return <AdminOrders token={fullToken} orders={order} />;
}
