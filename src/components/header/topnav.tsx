"use client";
import Link from "next/link";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import {
  faSearch,
  faCartShopping,
  faUser,
  faHeart,
  faBell,
} from "@fortawesome/free-solid-svg-icons"; // import the icons you need
import Image from "next/image";
import { logo } from "@/assests/images";
import CartDropdown from "./dropdown/cart";
import { CartContext, UserContext } from "@/store";
import { user_img2 } from "@/assests/users";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Menu from "./dropdown/menu";
import { logout } from "@/hooks/useAuth";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Product, UserInfo } from "@/features/types";
import { decodeToken } from "@/features/jwt-decode";
import { ACCESS_MAX_AGE, REFRESH_MAX_AGE } from "@/hooks/useData";
import { styled } from "@mui/material/styles";
import { CldImage } from "next-cloudinary";
import { imageLoader } from "@/features/img-loading";
import { useSearchParams } from "next/navigation";
import SwipeableTemporaryDrawer from "../drawer";
import NotifyDropdown from "./dropdown/notifications";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const Input = styled("input")(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  color: theme.palette.mode === "light" ? "#000" : "#fff",
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: 232,
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  top: "100%",
  listStyle: "none",
  borderRadius: "4px",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  overflow: "auto",
  maxHeight: 232,
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const TopNav = ({
  info,
  token,
  products,
}: {
  info?: UserInfo;
  token?: { accessToken?: string; refreshToken?: string };
  products: Product[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [onSearch, setOnSearch] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Create inline loading UI
  const { user, setUser } = useContext(UserContext);
  const { cartItems } = useContext(CartContext);

  const cookies = getCookies();
  const userInfo = info;
  useEffect(() => {
    if (token && token.accessToken == "" && token.refreshToken == "") {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    } else if (token && token.accessToken !== "" && token.refreshToken !== "") {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken!)!,
        maxAge: ACCESS_MAX_AGE,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken!)!,
        maxAge: REFRESH_MAX_AGE,
      });
    }
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
            role: "GUEST",
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      const id = toast.loading("Wating...");
      const res = await logout(cookies.accessToken!, cookies.refreshToken!);
      if (res.success) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.update(id, {
          render: `Logout Success`,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        router.push("/");
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
        role: "GUEST",
      });
      router.push("/login");
    }
  };

  const handleChange = (e: any) => {
    setKeyword(e.target.value);
  };

  const onSearchValue = (value: string) => {
    setKeyword(value);
    setOnSearch(false);
  };

  const searchProducts = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    router.push("/product?" + createQueryString("name", keyword));
    setKeyword("");
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
          className="bg-white rounded-[0.25rem] flex items-center relative col-span-6 sm:col-span-7 md:col-span-4 lg:col-span-5 xl:col-span-5 2xl:col-span-5 h-[2.75rem]"
          // action={`/search`}
          // method="post"
          onSubmit={searchProducts}
        >
          <Input
            value={keyword}
            onChange={handleChange}
            onFocus={() => setOnSearch(true)}
            name="keyword"
            autoComplete="off"
            className="outline-none px-2 text-sm truncate flex-1"
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
          ></Input>
          <button
            onClick={() => onSearchValue(keyword)}
            type="submit"
            className="absolute right-[0.25rem] transition-opacity hover:opacity-60 bg-primary-color
             cursor-pointer text-white grid place-content-center rounded-md py-[10px] px-5"
          >
            <FontAwesomeIcon className="icon" icon={faSearch}></FontAwesomeIcon>
          </button>
          {onSearch && keyword.length > 0 && (
            <Listbox
              key={"listbox"}
              sx={{
                width: "100%",
                maxHeight: "14rem",
                overflow: "auto",
              }}
            >
              {products &&
              products.filter((product) => {
                const value = keyword.toLowerCase();
                const name = product.name.toLowerCase();
                return value && name.includes(value) && name !== value;
              }).length == 0 ? (
                <div className="w-full h-[8rem] flex justify-center items-center text-xl text-text-color">
                  Không tìm thấy sản phẩm
                </div>
              ) : (
                products.map((product) => {
                  return (
                    <Link
                      key={product.productId}
                      href={`/product/${product.productId}`}
                    >
                      <li
                        className="flex justify-between item-center px-2 py-3 max-h-[6rem] gap-x-2
                        hover:bg-primary-color hover:text-white cursor-pointer"
                      >
                        <CldImage
                          key={"image-" + product.productId}
                          loader={imageLoader}
                          priority
                          className="max-w-[5rem] group-hover:shadow-sd"
                          alt="autocompleImg"
                          src={product.image}
                          width={120}
                          height={40}
                        ></CldImage>
                        <span
                          key={product.productId}
                          className="truncate cursor-pointer"
                        >
                          {product.name}
                        </span>
                      </li>
                    </Link>
                  );
                })
              )}
            </Listbox>
          )}
        </form>
        <ul
          className={`${
            !userInfo ? "justify-end" : "justify-center"
          } items-center md:col-span-5 xl:col-span-4 max-md:hidden flex`}
        >
          <li>
            {!userInfo && (
              <Menu
                dropdownContent={
                  <Paper
                    sx={{
                      zIndex: "3",
                    }}
                  >
                    <Link
                      href="/register"
                      prefetch={false}
                      className="w-full h-full"
                    >
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <LockOpenIcon />
                        <span className="truncate px-2">Đăng ký</span>
                      </div>
                    </Link>
                    <Link
                      href="/login"
                      prefetch={false}
                      className="w-full h-full"
                    >
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <LoginIcon />
                        <span className="truncate px-2">Đăng nhập</span>
                      </div>
                    </Link>
                  </Paper>
                }
                buttonChildren={
                  <Link href="/login" prefetch={false}>
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
                      href="profile/order-tracking"
                    >
                      <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
                        <HistoryIcon />
                        <span className="truncate px-2">Đơn mua</span>
                      </div>
                    </Link>
                    <div className="group p-2 text-left hover:bg-primary-color hover:text-white cursor-pointer transition-colors">
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
                      alt="avatar"
                      src={user.avatar ? user.avatar : user_img2.src}
                    ></Avatar>
                    <span className="cap text-white text-sm max-md:hidden truncate">
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
                      href="profile/order-tracking"
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
                      src={userInfo.avatar ? userInfo.avatar : user_img2.src}
                    ></Avatar>
                    <span className="lowercase text-white text-sm max-md:hidden">
                      {userInfo.fullname}
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
                    {cartItems.length}
                  </div>
                </div>
              }
            ></Menu>
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
                    className="group p-2 text-left hover:text-primary-color cursor-pointer transition-colors
                                max-h-[420px] overflow-y-auto"
                  >
                    <CartDropdown></CartDropdown>
                  </div>
                </Paper>
              }
              buttonChildren={
                <Link href="/cart">
                  <div className="flex flex-col gap-y-1 hover:opacity-60 transition-opacity">
                    <FontAwesomeIcon
                      className="relative text-white"
                      icon={faCartShopping}
                    ></FontAwesomeIcon>
                    <span className="text-white text-sm whitespace-nowrap">
                      Giỏ hàng
                    </span>
                  </div>
                  <div className="absolute -top-0.5 right-[12px] px-1.5 py-0.75 rounded-full text-white text-sm bg-secondary-color">
                    {cartItems.length}
                  </div>
                </Link>
              }
            ></Menu>
          </li>
        </ul>
        <div className="md:hidden block">
          <SwipeableTemporaryDrawer />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
