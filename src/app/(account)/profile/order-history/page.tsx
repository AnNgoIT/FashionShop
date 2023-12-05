import OrderHistory from "@/container/order/history";
import { orderItem } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getAllOrders } from "../order-tracking/page";

async function customFunction() {}

export default async function OrderHistoryPage() {
  const accessToken = getCookie("accessToken", { cookies }) || "";

  const res = await getAllOrders(accessToken);
  const order = res && res.success && (res.result.content as orderItem[]);
  const data = await customFunction();
  return <OrderHistory orders={order} />;
}
