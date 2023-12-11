import React, { Suspense } from "react";
import TopNav from "./topnav";
import { HeaderProps } from "./header";
import LoadingComponent from "../loading";

const AccountHeader = (props: HeaderProps) => {
  const { userInfo, fullToken, products, userCart } = props;
  return (
    <header className="font-sans relative top-0 left-0 right-0">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1] shadow-hd">
        <div className="grid grid-cols-12 container">
          <Suspense fallback={<LoadingComponent />}>
            <TopNav
              products={products}
              userCart={userCart}
              info={userInfo}
              token={fullToken}
            ></TopNav>
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;
