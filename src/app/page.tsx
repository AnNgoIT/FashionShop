import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Container from "@/container/container";
import { isTokenExpired } from "@/features/jwt-decode";
import { Category, Product, UserInfo } from "@/features/types";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAllCategories } from "./(user)/product/page";
import { prefetchAllProducts } from "./(user)/product/(detail)/[id]/page";

export const HTTP_PORT = "http://localhost:8080";

export const refreshLogin = async (refreshToken: string) => {
  try {
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
  } catch (error: any) {
    console.log(error);
  }
};

export const fetchUserCredentials = async (accessToken: string) => {
  try {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/customers/profile`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      next: {
        revalidate: 3600,
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json(); // parses JSON response into native JavaScript objects
  } catch (error: any) {
    console.log(error);
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
      console.log(res.status);
      return undefined;
    }

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    return res.json(); // parses JSON response into native JavaScript objects
  } catch (error: any) {
    console.log(error);
  }
};

const Home = async () => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const cateRes = await fetchAllCategories();
  const productRes = await prefetchAllProducts();
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
      } else {
        fullToken = { accessToken: "", refreshToken: "" };
      }
    }
  }
  let info: UserInfo = {
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: null,
    ewallet: null,
    role: "GUEST",
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

  const categories: Category[] =
    cateRes && cateRes.success && cateRes.result.content;
  const products: Product[] =
    productRes && productRes.success && productRes.result.content;
  return (
    <>
      <Header
        userInfo={userInfo}
        fullToken={fullToken}
        products={products}
      ></Header>
      <main className="font-sans min-h-[50rem] bg-white mt-[4.75rem]">
        <Container categories={categories}></Container>
      </main>
      <Footer></Footer>
    </>
  );
};
export default Home;
