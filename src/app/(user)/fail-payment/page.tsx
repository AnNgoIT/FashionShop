import { fetchUserCredentials, refreshLogin } from "@/app/page";
import FailPayment from "@/container/payment/fail-payment";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function FailPaymentPage() {
  const isPayment = getCookie("isPayment", { cookies });
  if (!isPayment) redirect("/");

  const userCredentialsRes = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );

  let userInfo = undefined,
    fullToken = undefined;

  if (userCredentialsRes.statusCode === 401) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res = await fetchUserCredentials(refresh.result.accessToken);
        userInfo = res.success
          ? {
              fullname: res.result.fullname,
              email: res.result.email,
              phone: res.result.phone,
              dob: res.result.dob,
              gender: res.result.gender,
              address: res.result.address,
              avatar: res.result.avatar,
              ewallet: res.result.ewallet,
              role: res.result.role,
            }
          : undefined;
      }
    }
  } else {
    userInfo = userCredentialsRes.success
      ? {
          fullname: userCredentialsRes.result.fullname,
          email: userCredentialsRes.result.email,
          phone: userCredentialsRes.result.phone,
          dob: userCredentialsRes.result.dob,
          gender: userCredentialsRes.result.gender,
          address: userCredentialsRes.result.address,
          avatar: userCredentialsRes.result.avatar,
          ewallet: userCredentialsRes.result.ewallet,
          role: userCredentialsRes.result.role,
        }
      : undefined;
  }

  return <FailPayment />;
}
