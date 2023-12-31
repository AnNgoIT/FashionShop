"use client";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons"; // import the icons you need
import Image from "next/image";
import { logo } from "@/assests/images";
import { CartContext, UserContext } from "@/store";
import { user_img2 } from "@/assests/users";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Menu from "./dropdown/menu";
import { getUserCart, logout } from "@/hooks/useAuth";
import {
  deleteCookie,
  getCookie,
  getCookies,
  hasCookie,
  setCookie,
} from "cookies-next";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { UserInfo, cartItem } from "@/features/types";
import { decodeToken } from "@/features/jwt-decode";
import NotifyDropdown from "./dropdown/notifications";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useLocal from "@/hooks/useLocalStorage";

const CartTopNav = ({
  info,
  token,
}: {
  info?: UserInfo;
  token?: { accessToken?: string; refreshToken?: string };
}) => {
  const router = useRouter();
  const pathName = usePathname();
  // Create inline loading UI
  const { user, setUser } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const local = useLocal();
  const cookies = getCookies();

  useEffect(() => {
    async function fetchUserCart() {
      if (hasCookie("accessToken")) {
        const res = await getUserCart(getCookie("accessToken")!);
        if (res.success) {
          setCartItems(res.result.cartItems);
        }
      }
    }
    if (pathName !== "/cart/checkout") {
      fetchUserCart();
    }
    setUser(
      info
        ? info
        : {
            fullname: null,
            email: "",
            phone: "",
            dob: null,
            gender: null,
            address: null,
            avatar: "",
            ewallet: 0,
            role: "GUEST",
          }
    );
    if (token && token.accessToken && token.refreshToken) {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken!)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken!)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const handleLogout = async () => {
    const id = toast.loading("Đang đăng xuất...");
    const res = await logout(cookies.accessToken!, cookies.refreshToken!);
    if (res.success) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      toast.update(id, {
        render: `Đăng xuất thành công`,
        type: "success",
        autoClose: 1000,
        isLoading: false,
      });
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.push("/");
      router.refresh();
    } else {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      toast.update(id, {
        render: `Đang đăng xuất...`,
        type: "warning",
        autoClose: 1000,
        isLoading: false,
      });
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <nav className="col-span-full py-3 px-4 grid">
      <div className="grid grid-flow-col grid-cols-12 items-center">
        <Link
          className="col-span-4 sm:col-span-4 md:col-span-3 px-3"
          href="/"
          as={"/"}
        >
          <Image
            className={`w-auto min-w-[5rem] h-[3.25rem] transition-all`}
            alt="Logo of the shop"
            src={logo}
            width={180}
            height={180}
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw"
            priority={true}
          ></Image>
        </Link>
        <ul
          className={`flex justify-end items-center col-span-8 sm:col-span-8 md:col-span-9`}
        >
          <li>
            {!info && (
              <Menu
                dropdownContent={
                  <Paper
                    sx={{
                      zIndex: "3",
                    }}
                  >
                    <Link href="/register" className="w-full h-full">
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <LockOpenIcon />
                        <span className="truncate px-2">Đăng ký</span>
                      </div>
                    </Link>
                    <Link href="/login" className="w-full h-full" as={"/login"}>
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <LoginIcon />
                        <span className="truncate px-2">Đăng nhập</span>
                      </div>
                    </Link>
                  </Paper>
                }
                buttonChildren={
                  <Link href="/login" as={"/login"}>
                    <div className="relative flex flex-col gap-y-1 hover:opacity-60 transition-opacity">
                      <FontAwesomeIcon
                        className="text-white"
                        icon={faUser}
                      ></FontAwesomeIcon>
                      <span className="text-white text-sm whitespace-nowrap">
                        Tài khoản
                      </span>
                    </div>
                  </Link>
                }
              ></Menu>
            )}
            {info && user.email !== "" && (
              <Menu
                arrowPos="70px"
                dropdownContent={
                  <Paper
                    sx={{
                      transform: {
                        xs: "translateX(-2rem)",
                        md: "translateX(-4.5rem)",
                      },
                      minWidth: "10.75rem",
                    }}
                  >
                    <Link className="w-full h-full" href="/profile">
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <AccountCircleIcon />
                        <span className="truncate pl-2">Tài khoản của tôi</span>
                      </div>
                    </Link>
                    <Link
                      className="w-full h-full"
                      href="/profile/order-tracking"
                    >
                      <div className="w-full h-full group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <HistoryIcon />
                        <span className="truncate px-2">Đơn mua</span>
                      </div>
                    </Link>
                    <div className="w-full h-full group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                      <button
                        className="w-full h-full flex justify-start"
                        onClick={handleLogout}
                      >
                        <LogoutIcon />
                        <span className="truncate px-2">Đăng xuất</span>
                      </button>
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
                    <span className="capitalize text-white text-sm max-md:hidden truncate">
                      {user.fullname}
                    </span>
                  </Link>
                }
              ></Menu>
            )}
            {info && user.email === "" && (
              <Menu
                arrowPos="70px"
                dropdownContent={
                  <Paper
                    sx={{
                      transform: {
                        xs: "translateX(-2rem)",
                        md: "translateX(-4.5rem)",
                      },

                      minWidth: "180px",
                    }}
                  >
                    <Link className="w-full h-full" href="/profile">
                      <div className="group p-2 text-left hover:text-primary-color cursor-pointer transition-colors">
                        <AccountCircleIcon />
                        <span className="truncate px-2">Tài khoản của tôi</span>
                      </div>
                    </Link>
                    <Link
                      className="w-full h-full"
                      href="/profile/order-tracking"
                    >
                      <div className="group p-2 text-left hover:text-primary-color cursor-pointer transition-colors">
                        <HistoryIcon />
                        <span className="truncate px-2">Đơn mua</span>
                      </div>
                    </Link>
                    <div className="group p-2 text-left hover:text-primary-color cursor-pointer transition-colors">
                      <button onClick={handleLogout}>
                        <LogoutIcon />
                        <span className="truncate px-2">Đăng xuất</span>
                      </button>
                    </div>
                  </Paper>
                }
                buttonChildren={
                  <Link
                    className="flex justify-center items-center gap-x-2"
                    href={"/profile"}
                  >
                    <Avatar
                      sizes="50vw"
                      alt="avatar"
                      src={info.avatar ? info.avatar : user_img2.src}
                    ></Avatar>
                    <span className=" text-white text-sm max-md:hidden">
                      {info.fullname}
                    </span>
                  </Link>
                }
              ></Menu>
            )}
          </li>
          {/* <li>
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
                    className="group p-2 text-left hover:text-primary-color cursor-pointer transition-colors
                              max-h-[460px] overflow-auto"
                  >
                    <NotifyDropdown />
                  </div>
                </Paper>
              }
              buttonChildren={
                <div className="flex flex-col gap-y-1 hover:opacity-60 transition-opacity">
                  <FontAwesomeIcon
                    className="relative text-white"
                    icon={faBell}
                  ></FontAwesomeIcon>
                  <span className="text-white text-sm whitespace-nowrap">
                    Thông báo
                  </span>
                  <div className="absolute -top-0.5 right-[22px] px-1.5 py-0.75 rounded-full text-white text-sm bg-secondary-color">
                    {info &&
                      cartItems &&
                      cartItems.length > 0 &&
                      cartItems.length}
                  </div>
                </div>
              }
            ></Menu>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default CartTopNav;
