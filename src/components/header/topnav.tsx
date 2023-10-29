"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
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
import { Avatar, Paper } from "@mui/material";
import CartDropdown from "./dropdown/cart";
import { CartContext } from "@/store/globalState";
import { user_img2 } from "@/assests/users";

const TopNav = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [scrolling, setScrolling] = useState<boolean>(false);
  // const [login, setLogin] = useState<boolean>(false);

  const searchProducts = () => {};

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
        return;
      } else setScrolling(false);
    };

    const cleanup = () => {
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return cleanup;
  }, []);

  return (
    <nav className="col-span-12 pt-2.5 mx-auto">
      <div className="grid grid-flow-col justify-center gap-x-2 place-items-center">
        <div>
          <Link href="/">
            <Image
              className={`w-auto min-w-[5rem] ${
                scrolling ? "h-[4rem]" : "h-[6rem]"
              } transition-all`}
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
            {false ? (
              <Menu
                dropdownContent={
                  <Paper sx={{ p: 1, transform: "translateX(-1rem)" }}>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <Link href="/register" prefetch={false}>
                        Register
                      </Link>
                    </div>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <Link href="/login" prefetch={false}>
                        Login
                      </Link>
                    </div>
                  </Paper>
                }
                buttonChildren={
                  <Link href="/login" prefetch={false}>
                    <FontAwesomeIcon
                      className="text-white hover:opacity-60 transition-opacity"
                      icon={faUser}
                    ></FontAwesomeIcon>
                  </Link>
                }
              ></Menu>
            ) : (
              <Menu
                arrowPos="70px"
                dropdownContent={
                  <Paper
                    sx={{
                      transform: {
                        xs: "translateX(-2rem)",
                        md: "translateX(-4.5rem)",
                      },

                      p: 1,
                      minWidth: "170px",
                    }}
                  >
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <Link href="/profile">My Account</Link>
                    </div>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <Link href="/order">Order Tracking</Link>
                    </div>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <Link href="/logout">Logout</Link>
                    </div>
                  </Paper>
                }
                buttonChildren={
                  <Link
                    className="flex justify-center items-center gap-x-2"
                    href={"/profile"}
                  >
                    <Avatar alt="avatar" src={user_img2.src}>
                      T
                    </Avatar>
                    <span className="lowercase text-white text-sm max-md:hidden">
                      thangnguyen138
                    </span>
                  </Link>
                }
              ></Menu>
            )}
          </li>
          <li>
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
                  <div className="absolute top-0.5 right-1.5 px-1.5 py-0.75 rounded-full text-white text-sm bg-secondary-color">
                    {cartItems.length}
                  </div>
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
