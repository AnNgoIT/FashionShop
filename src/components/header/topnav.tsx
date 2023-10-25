"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import {
  faSearch,
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // import the icons you need
import Image from "next/image";
import { logo } from "@/assests/images";
import Button from "@mui/material/Button";
import Menu from "./dropdown/menu";
import { Paper } from "@mui/material";
import CartDropdown from "./dropdown/cart";
import { CartContext } from "@/store/globalState";
import { imageLoader } from "@/features/img-loading";

const TopNav = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const searchProducts = () => {};

  return (
    <nav className="col-span-12 pt-2.5 mx-auto">
      <div className="grid grid-flow-col justify-center gap-x-2 place-items-center">
        <div>
          <Link href="/">
            <Image
              loader={imageLoader}
              placeholder="blur"
              className="w-auto min-w-[80px] min-h-[60px]"
              alt="Logo of the shop"
              src={logo}
              width={180}
              height={180}
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw"
              priority={true}
            ></Image>
          </Link>
        </div>
        <form
          className="bg-white px-2 rounded-[0.25rem]"
          action={`/search`}
          method="post"
          onSubmit={searchProducts}
        >
          <input
            className="outline-none p-2 text-sm"
            type="text"
            placeholder="Search..."
          ></input>
          <Button
            sx={{
              color: "#333",
              width: 7,
              minWidth: 0,
              maxHeight: "fit-content",
            }}
            className="transition-opacity hover:opacity-60"
          >
            <FontAwesomeIcon className="icon" icon={faSearch}></FontAwesomeIcon>
          </Button>
        </form>
        <ul className="flex justify-center items-center">
          <li>
            <Menu
              dropdownContent={
                <Paper sx={{ p: 1, transform: "translateX(-20px)" }}>
                  <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                    <Link className="" href="/register">
                      Register
                    </Link>
                  </div>
                  <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                    <Link className="" href="/login">
                      Login
                    </Link>
                  </div>
                </Paper>
              }
              buttonChildren={
                <Link href="/login">
                  <FontAwesomeIcon
                    className="text-white hover:opacity-60 transition-opacity"
                    icon={faUser}
                  ></FontAwesomeIcon>
                </Link>
              }
            ></Menu>
          </li>
          <li className="">
            <Menu
              dropdownContent={
                <Paper
                  sx={{
                    p: 0.5,
                    transform: "translateX(-190px)",
                    minWidth: "320px",
                  }}
                >
                  <div
                    className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors
                                max-h-[420px] overflow-y-auto"
                  >
                    <CartDropdown></CartDropdown>
                  </div>
                </Paper>
              }
              buttonChildren={
                <Link href="/cart">
                  <FontAwesomeIcon
                    className="relative text-white hover:opacity-60 transition-opacity"
                    icon={faCartShopping}
                  ></FontAwesomeIcon>
                  <label className="absolute top-0.5 right-1.5 px-1.5 py-0.75 rounded-full text-white text-sm bg-secondary-color">
                    {cartItems.length}
                  </label>
                </Link>
              }
            ></Menu>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
