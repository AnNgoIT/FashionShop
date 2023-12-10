import { HTTP_PORT, refreshLogin } from "@/app/page";
import Shipper from "@/container/shipper/shipper";
import { getCookie, hasCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

export const fetchAllShipperDeliveries = async (accessToken: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/users/shippers/deliveries`, {
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

export default async function ShipperPage() {
  const accessToken = getCookie("accessToken", { cookies });

  let refreshDeliveries = [],
    fullToken = undefined;
  if (!accessToken || hasCookie("refershToken", { cookies })) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const res = await refreshLogin(refreshToken);
    if (res.success) {
      fullToken = res.result;
      const newProducts = await fetchAllShipperDeliveries(
        res.result.accessToken
      );
      if (newProducts.success) {
        refreshDeliveries = newProducts;
      }
    }
  }
  const delivery =
    accessToken && (await fetchAllShipperDeliveries(accessToken));
  const result = delivery?.success
    ? delivery.result.deliveryList
    : refreshDeliveries.success
    ? refreshDeliveries.result.deliveryList
    : [];

  return <Shipper token={fullToken} deliveries={result} />;
}
