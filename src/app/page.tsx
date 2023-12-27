import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Container from "@/container/container";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

import {
  fetchAllCategories,
  prefetchAllProducts,
} from "./(guest)/product/page";
import dynamic from "next/dynamic";

// const Container = dynamic(() => import("@/container/container"), {
//   ssr: false,
//   loading: () => <LoadingComponent />,
// });

export const HTTP_PORT = process.env.NEXT_PUBLIC_API_URL;

export const refreshLogin = async (refreshToken: string) => {
  const res = await fetch(`${HTTP_PORT}/api/v1/auth/refresh-access-token`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({ refreshToken: refreshToken }), // body data type must match "Content-Type" header
  });

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  return res.json(); // parses JSON response into native JavaScript objects
};

async function fetchAllSaleBanners() {
  const res = await fetch(`${HTTP_PORT}/api/v1/banners`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    // cache: "no-cache",
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    next:{revalidate:1000},
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json();
}

export const fetchUserCredentials = async (
  accessToken: string,
  refreshToken: string
) => {
  if (accessToken || refreshToken) {
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
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
    }
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json(); // parses JSON response into native JavaScript objects
  }
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

  const refreshToken =
    getCookie("refreshToken", { cookies }) || paramsRefreshToken!;

  let userInfo = undefined;
  let fullToken =
    paramsAccessToken && paramsRefreshToken
      ? {
          accessToken: paramsAccessToken,
          refreshToken: paramsRefreshToken,
        }
      : undefined;

  const [userCredentialsRes, categoriesRes, productsRes, bannerRes] =
    await Promise.all([
      fetchUserCredentials(accessToken, refreshToken),
      fetchAllCategories(),
      prefetchAllProducts(),
      fetchAllSaleBanners(),
    ]);

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
  // if (userCredentialsRes?.statusCode === 401) {
  //   const refresh = await refreshLogin(
  //     getCookie("refreshToken", { cookies }) || ""
  //   );
  //   if (refresh.success) {
  //     fullToken = refresh.result;
  //     const res = await fetchUserCredentials(refresh.result.accessToken);
  //     userInfo = handleUserCredentialsResponse(res);
  //   }
  // }

  const handleApiResponse = (res: any) =>
    res?.success ? res.result.content : [];
  const categories = handleApiResponse(categoriesRes);
  const products = handleApiResponse(productsRes);
  const banners = handleApiResponse(bannerRes);
  return (
    <>
      <Header
        categories={categories}
        userInfo={userInfo}
        fullToken={fullToken}
        products={products}
      ></Header>
      <main className="font-sans bg-white mt-[4.75rem]">
        <Container
          products={products}
          categories={categories}
          banners={banners}
        ></Container>
      </main>
      <Footer></Footer>
    </>
  );
};

export default Home;
