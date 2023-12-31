import React from "react";
import CartTopNav from "./cart-topnav";
import { UserInfo } from "@/features/types";

export type CartHeaderProps = {
  userInfo?: UserInfo;
  fullToken?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

const CartHeader = (props: CartHeaderProps) => {
  const { userInfo, fullToken } = props;
  return (
    <header className="font-sans relative top-0 left-0 right-0">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1]">
        <div className="grid grid-cols-12 container">
          <CartTopNav info={userInfo} token={fullToken}></CartTopNav>
        </div>
      </div>
    </header>
  );
};

export default CartHeader;
