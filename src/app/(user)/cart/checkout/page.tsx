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
  const [userCredentialsRes, userCartRes] = await Promise.all([
    fetchUserCredentials(getCookie("accessToken", { cookies })!),
    userCart(getCookie("accessToken", { cookies })!),
  ]);

  let userInfo = undefined,
    cart = undefined,
    fullToken = undefined;

  if (
    userCredentialsRes.statusCode === 401 ||
    userCredentialsRes.status === 500
  ) {
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const [res, res2] = await Promise.all([
          fetchUserCredentials(refresh.result.accessToken),
          userCart(refresh.result.accessToken),
        ]);
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
        cart = res2.success ? res2.result.cartItems : undefined;
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
    cart = userCartRes.success ? userCartRes.result.cartItems : undefined;
  }
  return <Checkout userInfo={userInfo} userCart={cart} />;
};

export default CheckoutPage;
