import { fetchUserCredentials } from "@/app/page";
import Checkout from "@/container/cart/checkout";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const metadata = {
  title: "Checkout",
};

export type OrderItem = {
  id: number;
  name?: string;
  price: number;
  quantity: number;
};

const CheckoutPage = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;

  let userInfo = undefined,
    fullToken =
      accessToken && refreshToken
        ? {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        : undefined;
  const userCredentialsRes = await fetchUserCredentials(
    accessToken,
    refreshToken
  );

  const handleUserCredentialsResponse = async (res: any) => {
    if (accessToken) {
      userInfo = res?.success && {
        fullname: res.result.fullname,
        email: res.result.email,
        phone: res.result.phone,
        dob: res.result.dob,
        gender: res.result.gender,
        address: res.result.address,
        avatar: res.result.avatar,
        ewallet: res.result.ewallet,
        role: res.result.role,
      };
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const newUserInfo = await fetchUserCredentials(
        fullToken?.accessToken!,
        fullToken?.refreshToken!
      );
      userInfo = newUserInfo?.success && {
        fullname: newUserInfo.result.fullname,
        email: newUserInfo.result.email,
        phone: newUserInfo.result.phone,
        dob: newUserInfo.result.dob,
        gender: newUserInfo.result.gender,
        address: newUserInfo.result.address,
        avatar: newUserInfo.result.avatar,
        ewallet: newUserInfo.result.ewallet,
        role: newUserInfo.result.role,
      };
    }
  };
  await handleUserCredentialsResponse(userCredentialsRes);
  return <Checkout userInfo={userInfo} />;
};

export default CheckoutPage;
