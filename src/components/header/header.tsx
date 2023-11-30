import React from "react";
import BotNav from "./bottomnav";
import TopNav from "./topnav";
import { Category, Product, UserInfo } from "@/features/types";

export type HeaderProps = {
  userInfo?: UserInfo;
  fullToken?: {
    accessToken?: string;
    refreshToken?: string;
  };
  categories?: Category[];
  products: Product[];
};
const Header = (props: HeaderProps) => {
  const { userInfo, fullToken, categories, products } = props;
  return (
    <header className="font-sans">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1] fixed top-0 left-0 right-0 z-[1]">
        <div className="grid grid-cols-12 container">
          <TopNav
            products={products}
            info={userInfo}
            token={fullToken}
          ></TopNav>
          {/* <BotNav categories={categories}></BotNav> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
