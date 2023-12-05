import { HTTP_PORT } from "@/app/page";
import Cart from "@/container/cart/cart";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const userCart = async (accessToken: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/customers/carts`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (!res.ok) {
      return [];
    }

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    return res.json(); // parses JSON response into native JavaScript objects
  } catch (error: any) {}
};

const CartPage = async () => {
  const res = await userCart(getCookie("accessToken", { cookies })!);

  const cart = res && res.success && res.result.cartItems;
  return <Cart userCart={cart} />;
};

export default CartPage;
