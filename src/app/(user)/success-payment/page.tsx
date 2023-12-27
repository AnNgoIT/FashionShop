import SuccessPayment from "@/container/payment/success-payment";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Success Payment",
};

export default async function SuccessPaymentPage() {
  const isPayment = getCookie("isPayment", { cookies });
  if (!isPayment) redirect("/");

  return <SuccessPayment />;
}
