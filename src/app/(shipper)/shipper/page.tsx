import { HTTP_PORT, refreshLogin } from "@/app/page";
import Shipper from "@/container/shipper";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const fetchAllShipperDeliveries = async (
  accessToken: string,
  refreshToken: string
) => {
  if (accessToken || refreshToken) {
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
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
    }
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json();
  }
};

async function ShipperPage() {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;

  const delivery = await fetchAllShipperDeliveries(accessToken, refreshToken);

  let refreshDeliveries = [],
    fullToken = undefined;
  if (accessToken) {
    refreshDeliveries = delivery?.success && delivery.result.deliveryList;
  } else {
    const res = await refreshLogin(getCookie("refreshToken", { cookies })!);
    if (res.success) {
      fullToken = res.result;
      const newProducts = await fetchAllShipperDeliveries(
        res.result.accessToken,
        res.result.refreshToken
      );
      if (newProducts.success) {
        refreshDeliveries = newProducts.result.deliveryList;
      } else fullToken = { accessToken: undefined, refreshToken: undefined };
    }
  }

  return <Shipper token={fullToken} deliveries={refreshDeliveries} />;
}
export default ShipperPage;
