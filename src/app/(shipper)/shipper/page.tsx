import { HTTP_PORT, refreshLogin } from "@/app/page";
import Shipper from "@/container/shipper/shipper";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

const fetchAllShipperDeliveries = async (accessToken: string) => {
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

async function ShipperPage() {
  const accessToken = getCookie("accessToken", { cookies })!;

  const delivery = await fetchAllShipperDeliveries(accessToken);

  let refreshDeliveries = [],
    fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refershToken", { cookies })
  ) {
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
  const result =
    delivery && delivery.success
      ? delivery.result.deliveryList
      : refreshDeliveries.result.deliveryList;

  return <Shipper token={fullToken} deliveries={result} />;
}
export default ShipperPage;