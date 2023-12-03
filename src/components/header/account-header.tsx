import React from "react";
import TopNav from "./topnav";
import { HeaderProps } from "./header";

const AccountHeader = (props: HeaderProps) => {
  const { userInfo, fullToken, products } = props;
  return (
    <header className="font-sans relative top-0 left-0 right-0">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1] shadow-hd">
        <div className="grid grid-cols-12 container">
          <TopNav
            products={products}
            info={userInfo}
            token={fullToken}
          ></TopNav>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;
