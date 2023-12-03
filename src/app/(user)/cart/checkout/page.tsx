import { fetchUserCredentials } from "@/app/page";
import Checkout from "@/container/cart/checkout";
import { isTokenExpired } from "@/features/jwt-decode";
import { UserInfo } from "@/features/types";
import { refreshLogin } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userCart } from "../page";

export type OrderItem = {
  id: number;
  name?: string;
  price: number;
  quantity: number;
};

const CheckoutPage = async () => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  let result = null,
    fullToken;
  if (res.statusCode == 401) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      if (isTokenExpired(refreshToken)) {
        redirect("/login");
      }
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res2 = await fetchUserCredentials(refresh.result.accessToken);
        result = res2;
      } else redirect("/login");
    }
  }
  const cartRes = await userCart(getCookie("accessToken", { cookies })!);
  let info: UserInfo = {
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: null,
    ewallet: null,
    role: "",
  };
  const userInfo: UserInfo | undefined =
    res && res.success
      ? {
          ...info,
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
      : result && result.success
      ? {
          ...info,
          fullname: result.result.fullname,
          email: result.result.email,
          phone: result.result.phone,
          dob: result.result.dob,
          gender: result.result.gender,
          address: result.result.address,
          avatar: result.result.avatar,
          ewallet: result.result.ewallet,
          role: res.result.role,
        }
      : undefined;

  const cart = cartRes && cartRes.success && cartRes.result.cartItems;
  return <Checkout userInfo={userInfo} userCart={cart} />;
};

export default CheckoutPage;
