import OrderHistory from "@/container/order/history";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getAllOrders } from "../order-tracking/page";
import { refreshLogin } from "@/hooks/useAuth";

export default async function OrderHistoryPage() {
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
  return <OrderHistory orders={order} />;
}
