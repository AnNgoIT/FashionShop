import { HTTP_PORT, refreshLogin } from "@/app/page";
import Cart from "@/container/cart/cart";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

export const metadata = {
  title: "Cart",
};

const userCart = async (accessToken: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/users/customers/carts`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json(); // parses JSON response into native JavaScript objects
};

const CartPage = async () => {
  const res = await userCart(getCookie("accessToken", { cookies })!);

  let refreshUserCart = undefined,
    fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      fullToken = refresh.result;
      const res = await userCart(refresh.result.accessToken);
      refreshUserCart = res.result;
    } else fullToken = { accessToken: undefined, refreshToken: undefined };
  }

  const cart =
    res && res.success
      ? res.result.cartItems
      : refreshUserCart
      ? refreshUserCart.cartItems
      : undefined;
  return <Cart userCart={cart} />;
};

export default CartPage;
