"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import {
  faSearch,
  faCartShopping,
  faUser,
  faHeart,
} from "@fortawesome/free-solid-svg-icons"; // import the icons you need
import Image from "next/image";
import { logo } from "@/assests/images";
import CartDropdown from "./dropdown/cart";
import { CartContext, UserContext, UserProvider } from "@/store";
import { user_img2 } from "@/assests/users";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Menu from "./dropdown/menu";
import { logout, useUserCredentials } from "@/hooks/useAuth";
import { deleteCookie, getCookies } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/features/types";

const TopNav = ({ info }: { info?: UserInfo }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Create inline loading UI
  const { user, setUser } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const cookies = getCookies();
  const userInfo = info;
  useEffect(() => {
    setUser(
      userInfo
        ? userInfo
        : {
            fullname: null,
            email: "",
            phone: "",
            dob: null,
            gender: null,
            address: null,
            avatar: "",
            ewallet: 0,
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      const res = await logout(cookies.accessToken!, cookies.refreshToken!);
      const id = toast.loading("Wating...");
      if (res.success) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.update(id, {
          render: `Logouted Success`,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });

        startTransition(() => {
          // Refresh the current route and fetch new data from the server without
          // losing client-side browser or React state.
          router.refresh();
        });
      } else {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.update(id, {
          render: `Please Login!`,
          type: "warning",
          autoClose: 1000,
          isLoading: false,
        });
        router.push("/login");
      }
    } catch (error) {
    } finally {
      setUser({
        fullname: null,
        email: "",
        phone: "",
        dob: null,
        gender: null,
        address: null,
        avatar: "",
        ewallet: 0,
      });
      router.push("/login");
    }
  };

  const searchProducts = () => {};

  return (
    <nav className="col-span-12 pt-2.5 mx-auto">
      <div className="grid grid-flow-col justify-center gap-x-2 place-items-center">
        <Link className="px-3 py-0.5" href="/" as={"/"}>
          <Image
            // loader={imageLoader}
            className={`w-auto min-w-[5rem] h-[3.25rem] transition-all`}
            alt="Logo of the shop"
            src={logo}
            width={180}
            height={180}
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw"
            priority={true}
          ></Image>
        </Link>
        <form
          className="bg-white px-2 rounded-[0.25rem] flex"
          action={`/search`}
          method="post"
          onSubmit={searchProducts}
        >
          <input
            name="keywords"
            className="outline-none p-2 text-sm max-sm:w-[7rem]"
            type="text"
            placeholder="Search..."
          ></input>
          <button className="transition-opacity hover:opacity-60">
            <FontAwesomeIcon className="icon" icon={faSearch}></FontAwesomeIcon>
          </button>
        </form>
        <ul className="flex justify-center items-center">
          <li>
            {!userInfo && (
              <Menu
                dropdownContent={
                  <Paper
                    sx={{ p: 1, transform: "translateX(-1rem)", zIndex: "3" }}
                  >
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
            )}
            {userInfo && user.email !== "" && (
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
                      <Link href="profile/order-tracking">Order Tracking</Link>
                    </div>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </Paper>
                }
                buttonChildren={
                  <Link
                    className="flex justify-center items-center gap-x-2"
                    href={"/profile"}
                  >
                    <Avatar
                      alt="avatar"
                      src={user.avatar ? user.avatar : user_img2.src}
                    ></Avatar>
                    <span className="lowercase text-white text-sm max-md:hidden">
                      {user.fullname}
                    </span>
                  </Link>
                }
              ></Menu>
            )}
            {userInfo && user.email === "" && (
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
                      <Link href="profile/order-tracking">Order Tracking</Link>
                    </div>
                    <div className="group py-2 px-4 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </Paper>
                }
                buttonChildren={
                  <Link
                    className="flex justify-center items-center gap-x-2"
                    href={"/profile"}
                  >
                    <Avatar
                      alt="avatar"
                      src={userInfo.avatar ? userInfo.avatar : user_img2.src}
                    ></Avatar>
                    <span className="lowercase text-white text-sm max-md:hidden">
                      {userInfo.fullname}
                    </span>
                  </Link>
                }
              ></Menu>
            )}
            {/* <div className="flex justify-center items-center gap-x-2">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={100} height={20} />
            </div> */}
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
          <li>
            <Menu
              dropdownContent={undefined}
              buttonChildren={
                <Link href="/wishlist">
                  <FontAwesomeIcon
                    className="relative text-white hover:opacity-60 transition-opacity"
                    icon={faHeart}
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
