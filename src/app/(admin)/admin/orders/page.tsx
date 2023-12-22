import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminOrders from "@/container/admin/admin-order";
import { orderItem } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

async function fetchAllOrdersAdmin(
  accessToken: string,
  refreshToken: string
) {
  if (accessToken || refreshToken) {
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
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
      else return undefined;
    }
    return res.json(); // parses JSON response into native JavaScript objects
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
}

const AdminOrder = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;

  const refreshToken = getCookie("refreshToken", { cookies })!;

  const res = await fetchAllOrdersAdmin(accessToken, refreshToken);

  let refreshedOrders: orderItem[] = [],
    fullToken = undefined;

  const handleOrdersResponse = async (res: any) => {
    if (accessToken) {
      refreshedOrders = res?.success && res.result.content;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const newOrders = await fetchAllOrdersAdmin(
        fullToken?.accessToken!,
        fullToken?.refreshToken!
      );
      refreshedOrders = newOrders?.success && newOrders.result.content;
    }
  };
  await handleOrdersResponse(res);

  return <AdminOrders token={fullToken} orders={refreshedOrders} />;
};
export default AdminOrder;
