import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Container from "@/container/container";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { cache } from "react";

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
const Home = async ({
  searchParams,
}: {
  searchParams?: {
    accessToken?: string;
    refreshToken?: string;
  };
}) => {
  const paramsAccessToken = searchParams?.accessToken;
  const paramsRefreshToken = searchParams?.refreshToken;

  const accessToken =
    getCookie("accessToken", { cookies }) || paramsAccessToken!;
  let userInfo = undefined,
    cart = undefined,
    fullToken =
      paramsAccessToken && paramsRefreshToken ? searchParams : undefined;
  const [userCredentialsRes] = await Promise.all([
    fetchUserCredentials(accessToken),
  ]);

  userInfo = userCredentialsRes &&
    userCredentialsRes.success && {
      fullname: userCredentialsRes.result.fullname,
      email: userCredentialsRes.result.email,
      phone: userCredentialsRes.result.phone,
      dob: userCredentialsRes.result.dob,
      gender: userCredentialsRes.result.gender,
      address: userCredentialsRes.result.address,
      avatar: userCredentialsRes.result.avatar,
      ewallet: userCredentialsRes.result.ewallet,
      role: userCredentialsRes.result.role,
    };

  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      fullToken = refresh.result;
      const [res] = await Promise.all([
        fetchUserCredentials(refresh.result.accessToken),
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
    }
  }

  const categoriesRes = await fetchAllCategories();
  const productsRes = await prefetchAllProducts();

  const categories =
    categoriesRes && categoriesRes.success && categoriesRes.result.content;
  const products =
    productsRes && productsRes.success && productsRes.result.content;

  return (
    <>
      <Header
        userInfo={userInfo}
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
