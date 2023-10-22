import React from "react";
import BotNav from "./bottomnav";
import TopNav from "./topnav";

const Header = () => {
  return (
    <header className="font-sans fixed top-0 left-0 right-0 z-10">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-[#0e9de9] to-[#639df1]">
        <div className="grid grid-cols-12 ">
          <TopNav></TopNav>
          <BotNav></BotNav>
        </div>
      </div>
    </header>
  );
};

export default Header;
