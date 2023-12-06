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
import { redirect } from "next/dist/server/api-utils";

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

// const Home = async () => {
//   const res = await fetchUserCredentials(
//     getCookie("accessToken", { cookies })!
//   );

//   let cartRes = await userCart(getCookie("accessToken", { cookies })!);

//   let result = undefined,
//     refreshUserCart = undefined,
//     fullToken = undefined;
//   if (res.statusCode == 401 || res.status == 500) {
//     if (hasCookie("refreshToken", { cookies })) {
//       const refreshToken = getCookie("refreshToken", { cookies })!;
//       const refresh = await refreshLogin(refreshToken);
//       if (refresh.success) {
//         fullToken = refresh.result;
//         const res = await fetchUserCredentials(refresh.result.accessToken);
//         const res2 = await userCart(refresh.result.accessToken);
//         result = res.result;
//         refreshUserCart = res2.result;
//       }
//     }
//   }

//   const userInfo: UserInfo | undefined =
//     res && res.success
//       ? {
//           fullname: res.result.fullname,
//           email: res.result.email,
//           phone: res.result.phone,
//           dob: res.result.dob,
//           gender: res.result.gender,
//           address: res.result.address,
//           avatar: res.result.avatar,
//           ewallet: res.result.ewallet,
//           role: res.result.role,
//         }
//       : result
//       ? {
//           fullname: result.fullname,
//           email: result.email,
//           phone: result.phone,
//           dob: result.dob,
//           gender: result.gender,
//           address: result.address,
//           avatar: result.avatar,
//           ewallet: result.ewallet,
//           role: res.role,
//         }
//       : undefined;

//   const cart =
//     cartRes && cartRes.success
//       ? cartRes.result.cartItems
//       : refreshUserCart
//       ? refreshUserCart.cartItems
//       : undefined;

//   const cateRes = await fetchAllCategories();
//   const productRes = await prefetchAllProducts();

//   const categories: Category[] =
//     cateRes && cateRes.success && cateRes.result.content;
//   const products: Product[] =
//     productRes && productRes.success && productRes.result.content;

//   return (
//     <>
//       <Header
//         userInfo={userInfo}
//         userCart={cart}
//         fullToken={fullToken}
//         products={products}
//       ></Header>
//       <main className="font-sans bg-white mt-[4.75rem]">
//         <Container products={products} categories={categories}></Container>
//       </main>
//       <Footer></Footer>
//     </>
//   );
// };
const Home = async () => {
  const [userCredentialsRes, userCartRes, categoriesRes, productsRes] =
    await Promise.all([
      fetchUserCredentials(getCookie("accessToken", { cookies })!),
      userCart(getCookie("accessToken", { cookies })!),
      fetchAllCategories(),
      prefetchAllProducts(),
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

  const categories =
    categoriesRes && categoriesRes.success && categoriesRes.result.content;
  const products =
    productsRes && productsRes.success && productsRes.result.content;

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
