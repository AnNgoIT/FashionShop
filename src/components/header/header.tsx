import React from "react";
import BotNav from "./bottomnav";
import TopNav from "./topnav";

const Header = () => {
  return (
    <header className="font-sans sticky top-0 left-0 right-0">
      <div className="bg-gradient-to-l md:bg-gradient-to-r from-sky-500 to-indigo-500">
        <div className="grid grid-cols-12 ">
          <TopNav></TopNav>
          <BotNav></BotNav>
        </div>
      </div>
    </header>
  );
};

export default Header;
