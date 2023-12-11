import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminOrders from "@/container/admin/admin-order";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

async function fetchAllOrdersAdmin(accessToken: string) {
  if (!accessToken || accessToken.length == 0) {
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
    return res.json(); // parses JSON response into native JavaScript objects
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
}

const AdminOrderPage = async () => {
  const res = await fetchAllOrdersAdmin(getCookie("accessToken", { cookies })!);

  let refreshedOrders = [],
    fullToken = undefined;
  if (
    (!res && hasCookie("refreshToken", { cookies })) ||
    (!hasCookie("accessToken", { cookies }) &&
      hasCookie("refreshToken", { cookies }))
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refershProducts = await refreshLogin(refreshToken);
    if (refershProducts.success) {
      fullToken = refershProducts.result;
      const newOrders = await fetchAllOrdersAdmin(
        refershProducts.result.accessToken
      );
      if (newOrders.success) {
        refreshedOrders = newOrders.result.content;
      }
    }
  }

  const order = res && res.success ? res.result.content : refreshedOrders;
  return <AdminOrders token={fullToken} orders={order} />;
};
export default AdminOrderPage;
