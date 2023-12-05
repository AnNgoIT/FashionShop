import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Container from "@/container/container";
import { Category, Product, UserInfo } from "@/features/types";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import {
  fetchAllCategories,
  prefetchAllProducts,
} from "./(guest)/product/page";
import { userCart } from "./(user)/cart/page";

export const HTTP_PORT = process.env.NEXT_PUBLIC_API_URL;

export const refreshLogin = async (refreshToken: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/auth/refresh-access-token`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({ refreshToken: refreshToken }), // body data type must match "Content-Type" header
  });
  if (!res.ok) {
    // console.log(res);
    // This will activate the closest `error.js` Error Boundary
    // throw new Error("Failed to refreshToken");
  }

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  return res.json(); // parses JSON response into native JavaScript objects
};

export const fetchUserCredentials = async (accessToken: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/users/profile`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache",
    mode: "same-origin", // no-cors, *cors, same-origin
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

export const logout = async (accessToken: string, refreshToken: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/auth/logout?${refreshToken}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
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
      return undefined;
    }

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json(); // parses JSON response into native JavaScript objects
  } catch (error: any) {}
};

const Home = async () => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const cateRes = await fetchAllCategories();
  const productRes = await prefetchAllProducts();
  const cartRes = await userCart(getCookie("accessToken", { cookies })!);

  let result = undefined,
    fullToken = undefined;
  if (res.statusCode == 401) {
    if (hasCookie("refreshToken", { cookies })) {
      console.log("Hello");
      const refreshToken = getCookie("refreshToken", { cookies })!;
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        fullToken = refresh.result;
        const res = await fetchUserCredentials(refresh.result.accessToken);
        result = res;
      }
    }
  }

  const userInfo: UserInfo | undefined =
    res && res.success
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
      : result && result.success
      ? {
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

  const categories: Category[] =
    cateRes && cateRes.success && cateRes.result.content;
  const products: Product[] =
    productRes && productRes.success && productRes.result.content;

  const cart = cartRes && cartRes.success && cartRes.result.cartItems;
  return (
    <>
      <Header
        userInfo={userInfo}
        userCart={cart}
        fullToken={fullToken}
        products={products}
      ></Header>
      <main className="font-sans bg-white mt-[4.75rem]">
        <Container products={products} categories={categories}></Container>
      </main>
      <Footer></Footer>
    </>
  );
};
export default Home;
