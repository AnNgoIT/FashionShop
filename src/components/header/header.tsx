"use client";
import { Suspense } from "react";
import TopNav from "./topnav";
import { Product, UserInfo, cartItem } from "@/features/types";
import { usePathname } from "next/navigation";
import LoadingComponent from "../loading";

export type HeaderProps = {
  userInfo?: UserInfo;
  fullToken?: {
    accessToken?: string;
    refreshToken?: string;
  };
  userCart?: cartItem[];
  products: Product[];
};
const Header = (props: HeaderProps) => {
  const pathName = usePathname();
  const { userInfo, fullToken, userCart, products } = props;
  return (
    <header className="font-sans">
      <div
        className={`bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1]
       fixed top-0 left-0 right-0 ${
         pathName.includes("category") ? "z-[1]" : "z-[1]"
       }`}
      >
        <div className="grid grid-cols-12 container">
          <Suspense fallback={<LoadingComponent />}>
            <TopNav
              userCart={userCart}
              products={products}
              info={userInfo}
              token={fullToken}
            ></TopNav>
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
