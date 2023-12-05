import { getAllOrders } from "@/app/(account)/profile/order-tracking/page";
import AdminOrders from "@/container/admin/admin-order";
import { orderItem } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

async function customFunction() {}

export default async function AdminOrderPage() {
  const accessToken = getCookie("accessToken", { cookies }) || "";

  const res = await getAllOrders(accessToken);
  const order = res && res.success && (res.result.content as orderItem[]);
  return <AdminOrders orders={order}/>;
}
