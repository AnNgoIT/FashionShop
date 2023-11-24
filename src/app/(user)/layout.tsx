import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { getCookie } from "cookies-next";
import { fetchUserCredentials } from "../page";
import { cookies } from "next/headers";
import { Category, Product, UserInfo } from "@/features/types";
import { ReactNode } from "react";
import { fetchAllCategories } from "./product/page";
import { prefetchAllProducts } from "./product/(detail)/[id]/page";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const res = await fetchUserCredentials(
    getCookie("accessToken", { cookies })!
  );
  const productRes = await prefetchAllProducts();
  const cateRes = await fetchAllCategories();
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

  const categories: Category[] =
    cateRes && cateRes.success && cateRes.result.content;
  const products: Product[] =
    productRes && productRes.success && productRes.result.content;
  return (
    <>
      <Header
        userInfo={userInfo}
        categories={categories}
        products={products}
      ></Header>
      {children}
      <Footer></Footer>
    </>
  );
};

export default UserLayout;
