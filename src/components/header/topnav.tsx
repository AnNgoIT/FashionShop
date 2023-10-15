"use client";
import Link from "next/link";
import React from "react";
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
import { Paper, Typography } from "@mui/material";
import CartDropdown from "./dropdown/cart";

const TopNav = () => {
  const searchProducts = () => {};

  return (
    <nav className="col-span-12 pt-2.5 mx-auto">
      <div className="grid grid-flow-col justify-center gap-x-2 place-items-center">
        <div className="">
          <Link href="/">
            <Image
              className=""
              alt="Logo of the shop"
              src={logo}
              width={180}
              height={100}
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw"
              priority
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
                    className="hover:text-white transition-colors"
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
                    className="hover:text-white transition-colors"
                    icon={faCartShopping}
                  ></FontAwesomeIcon>
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
