import FailPayment from "@/container/payment/fail-payment";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Fail Payment",
};

export default async function FailPaymentPage() {
  const isPayment = getCookie("isPayment", { cookies });
  if (!isPayment) redirect("/");

  return <FailPayment />;
}
