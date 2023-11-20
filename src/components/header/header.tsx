import React from "react";
import BotNav from "./bottomnav";
import TopNav from "./topnav";
import { UserInfo } from "@/features/types";

type HeaderProps = {
  userInfo?: UserInfo;
};
const Header = (props: HeaderProps) => {
  const { userInfo } = props;
  return (
    <header className="font-sans">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1] fixed top-0 left-0 right-0 z-[1]">
        <div className="grid grid-cols-12 ">
          <TopNav info={userInfo}></TopNav>
          <BotNav></BotNav>
        </div>
      </div>
    </header>
  );
};

export default Header;
