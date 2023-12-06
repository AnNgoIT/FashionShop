import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getCookie, hasCookie } from "cookies-next";
import { fetchUserCredentials, refreshLogin } from "../page";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { userCart } from "../(user)/cart/page";
import { prefetchAllProducts } from "./product/page";

const GuestLayout = async ({ children }: { children: ReactNode }) => {
  const [userCredentialsRes, userCartRes, productsRes] = await Promise.all([
    fetchUserCredentials(getCookie("accessToken", { cookies })!),
    userCart(getCookie("accessToken", { cookies })!),
    prefetchAllProducts(),
  ]);

  let userInfo = undefined,
    cart = undefined,
    fullToken = undefined;

  if (userCredentialsRes.statusCode === 401) {
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
  const products =
    productsRes && productsRes.success && productsRes.result.content;
  return (
    <>
      <Header
        userInfo={userInfo}
        products={products}
        userCart={cart}
        fullToken={fullToken}
      />
      {children}
      <Footer />
    </>
  );
};

export default GuestLayout;
