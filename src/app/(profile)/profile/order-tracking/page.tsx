import { HTTP_PORT, refreshLogin } from "@/app/page";
import OrderTracking from "@/container/order/tracking";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function getAllOrders(accessToken: string) {
  const res = await fetch(`${HTTP_PORT}/api/v1/users/customers/orders`, {
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

export default async function OrderTrackingPage() {
  const accessToken = getCookie("accessToken", { cookies })!;

  const res = await getAllOrders(accessToken);

  let result = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      const res = await getAllOrders(refresh.result.accessToken);
      result = res.result;
    }
  }
  const order =
    res && res.success
      ? res.result.content
      : result
      ? result.content
      : undefined;
  return <OrderTracking orders={order} />;
}
