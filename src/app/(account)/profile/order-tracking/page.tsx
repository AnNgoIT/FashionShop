import { HTTP_PORT } from "@/app/page";
import OrderTracking from "@/container/order/tracking";
import { orderItem } from "@/features/types";
import { getCookie } from "cookies-next";
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
  const accessToken = getCookie("accessToken", { cookies }) || "";

  const res = await getAllOrders(accessToken);
  const order = res && res.success && (res.result.content as orderItem[]);
  return <OrderTracking orders={order} />;
}
