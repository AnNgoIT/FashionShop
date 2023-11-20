"use server";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Container from "@/container/container";
import { isTokenExpired } from "@/features/jwt-decode";
import { UserInfo } from "@/features/types";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const HTTP_PORT = "http://localhost:8080";

const refreshLogin = async (refreshToken: string) => {
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
  const res = await fetch(`${HTTP_PORT}/api/v1/users/customers/profile`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
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
    if (hasCookie("refreshToken", { cookies })) {
      const refreshToken = getCookie("refreshToken", { cookies })!;
      if (isTokenExpired(refreshToken)) {
        deleteCookie("accessToken", { cookies });
        deleteCookie("refreshToken", { cookies });
        redirect("/login");
      }
      const refresh = await refreshLogin(refreshToken);
      if (refresh.success) {
        const reres = await fetch(
          `${HTTP_PORT}/api/v1/users/customers/profile`,
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "same-origin", // no-cors, *cors, same-origin
            cache: "force-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refresh.result.accessToken}`,
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          }
        );
        if (!reres.ok) throw new Error("Error when refreshing");
        return reres.json();
      }
      // This will activate the closest `error.js` Error Boundary
      // if (!refresh.ok){ throw new Error("Error"); }
    }
    // else throw new Error("Please Login!");
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  return res.json(); // parses JSON response into native JavaScript objects
};

export const logout = async (accessToken: string, refreshToken: string) => {
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
};

const Home = async () => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  let info: UserInfo = {
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: null,
    ewallet: null,
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
        }
      : undefined;

  return (
    <>
      <Header userInfo={userInfo}></Header>
      <main className="font-sans min-h-[800px] bg-white mt-[105px]">
        <Container></Container>
      </main>
      <Footer></Footer>
    </>
  );
};
export default Home;
