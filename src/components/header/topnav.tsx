"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import {
  faSearch,
  faCartShopping,
  faUser,
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
import { getUserCart, logout } from "@/hooks/useAuth";
import {
  deleteCookie,
  getCookie,
  getCookies,
  hasCookie,
  setCookie,
} from "cookies-next";
import { toast } from "react-toastify";
import { Category, Product, UserInfo, cartItem } from "@/features/types";
import { decodeToken } from "@/features/jwt-decode";
import { styled } from "@mui/material/styles";
import { imageLoader } from "@/features/img-loading";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SwipeableTemporaryDrawer from "../drawer";
import NotifyDropdown from "./dropdown/notifications";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import useLocal from "@/hooks/useLocalStorage";
import CategoryIcon from "@mui/icons-material/Category";
import { Suspense } from "react";
import { LoadingComponent } from "../loading";
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
type NavProps = {
  info?: UserInfo;
  userCart?: cartItem[];
  token?: { accessToken?: string; refreshToken?: string };
  products?: Product[];
  categories?: Category[];
};

const TopNav = (props: NavProps) => {
  const tokenParams = useSearchParams();

  const { info, token, products, categories } = props;
  const { replace, refresh } = useRouter();
  const router = useRouter();
  const pathName = usePathname();

  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("query") || "");
  const [onSearch, setOnSearch] = useState(false);
  const local = useLocal();
  // Create inline loading UI
  const { user, setUser } = useContext(UserContext);
  const { cartItems, setCartItems } = useContext(CartContext);
  const [isHidden, setIsHidden] = useState(true);

  const cookies = getCookies();

  useEffect(() => {
    const removeTokenParams = tokenParams.get("accessToken");
    if (removeTokenParams) {
      replace(`${pathName}`, { scroll: false });
    }
    async function fetchUserCart() {
      if (hasCookie("accessToken")) {
        const res = await getUserCart(getCookie("accessToken")!);
        if (res.success) {
          setCartItems(res.result.cartItems);
        }
      }
    }
    fetchUserCart();

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
        expires: decodeToken(token.accessToken)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      local.removeItem("viewedProducts");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleBlur = () => {
    // Logic để ẩn thẻ khi focus ra khỏi input
    setIsHidden(true);
  };

  const handleFocus = () => {
    setOnSearch(true);
    // Logic khi focus vào input, có thể làm gì đó tại đây nếu cần
    setIsHidden(false);
  };

  let isProcessing = false;

  const handleLogout = async () => {
    // if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
    //   warningMessage("Đang tạo lại phiên đăng nhập mới");
    //   router.refresh();
    //   return;
    // } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
    //   warningMessage("Vui lòng đăng nhập để dùng chức năng này");
    //   router.push("/login");
    //   router.refresh();
    //   return;
    // }

    if (isProcessing) return; // Nếu đang xử lý, không cho phép gọi API mới
    isProcessing = true; // Đánh dấu đang xử lý

    try {
      const res = await logout(cookies.accessToken!, cookies.refreshToken!);
      if (res.success) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        successMessage("Đăng xuất thành công");
        local.removeItem("viewedProducts");
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
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
        setCartItems([]);
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      router.push("/login");
      router.refresh();
    } finally {
      isProcessing = false;
    }
  };

  const handleChange = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleSearchProducts = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (keyword && keyword.trim().length > 0) {
      params.set("query", keyword.trim());
      try {
        replace(`/product?${params.toString()}`);
        // setKeyword("");
        successMessage("Tìm kiếm thành công");
      } catch (error) {
        // setKeyword("");
        errorMessage("Tìm kiếm thất bại");
      }
    } else {
      params.delete("query");
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

        <div
          className={`${
            !pathName.includes("login") &&
            !pathName.includes("register") &&
            !pathName.includes("forgot-password") &&
            !pathName.includes("profile") &&
            ""
          } rounded-[0.25rem] flex items-center relative col-span-6 sm:col-span-7 md:col-span-4 lg:col-span-5 h-[2.75rem]`}
        >
          {!pathName.includes("login") &&
            !pathName.includes("register") &&
            !pathName.includes("forgot-password") &&
            !pathName.includes("profile") && (
              <>
                <Menu
                  dropdownContent={
                    <Paper
                      sx={{
                        p: 0.5,
                        transform: "translateX(-68px)",
                        minWidth: "400px",
                        width: "max-content",
                        borderRadius: "10px",
                      }}
                    >
                      <ul className="group p-2 grid grid-cols-3 md:grid-cols-4 gap-x-2">
                        <p className="col-span-full p-4 pt-0 text-3xl text-primary-color text-left">
                          Danh mục sản phẩm
                        </p>
                        {categories &&
                          categories.map((category) => {
                            return (
                              <div
                                key={category.categoryId}
                                className=" text-text-color col-span-1 grid grid-cols-1 
                                place-items-start text-left px-2"
                              >
                                <Link href={`/category/${category.name}`}>
                                  <p
                                    className="py-1 px-2 grid place-content-center truncate hover:text-primary-color 
                                  transition-colors cursor-pointer"
                                  >
                                    {category.name}
                                  </p>
                                </Link>
                              </div>
                            );
                          })}
                      </ul>
                    </Paper>
                  }
                  buttonChildren={
                    <div className="flex flex-col">
                      <CategoryIcon sx={{ fontSize: "2rem", color: "white" }} />
                    </div>
                  }
                  arrowPos="104px"
                ></Menu>
                <Suspense fallback={<LoadingComponent />}>
                  <Input
                    value={keyword}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchProducts();
                      }
                    }}
                    name="keyword"
                    autoComplete="off"
                    className="outline-none px-4 py-3 text-sm truncate flex-1 rounded-lg"
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                  ></Input>
                  <button
                    type="button"
                    name="search-button"
                    onClick={handleSearchProducts}
                    className="absolute right-[0.25rem] transition-opacity hover:opacity-60 bg-primary-color
             cursor-pointer text-white grid place-content-center rounded-md py-[10px] px-5"
                  >
                    <FontAwesomeIcon
                      className="icon"
                      icon={faSearch}
                    ></FontAwesomeIcon>
                  </button>
                  {!isHidden && onSearch && keyword.length > 0 && (
                    <Listbox
                      key={"listbox"}
                      sx={{
                        width: "88.5%",
                        top: "101%",
                        maxHeight: "18rem",
                        transform: "translateX(13%)",
                        overflow: "auto",
                      }}
                    >
                      {products &&
                      products.filter((product) => {
                        const value = keyword.toLowerCase();
                        const name = product.name.toLowerCase();
                        return value && name.includes(value);
                      }).length == 0 ? (
                        <div className="w-full h-[8rem] flex justify-center items-center text-xl text-text-color">
                          Không tìm thấy sản phẩm
                        </div>
                      ) : (
                        products &&
                        products
                          .filter((product) => {
                            const value = keyword.toLowerCase();
                            const name = product.name.toLowerCase();
                            return value && name.includes(value);
                          })
                          .map((product) => {
                            return (
                              <Link
                                key={product.productId}
                                href={`/product/${product.productId}`}
                                onMouseDown={(e) => {
                                  router.push(`/product/${product.productId}`);
                                  setOnSearch(false);
                                  setKeyword("");
                                }}
                              >
                                <li
                                  className="flex item-center p-3 max-h-max gap-x-2
                        hover:bg-primary-color hover:text-white cursor-pointer border-b border-border-color"
                                >
                                  <div className="border border-border-color max-w-[5rem] h-max">
                                    <Image
                                      loader={imageLoader}
                                      blurDataURL={product.image}
                                      placeholder="blur"
                                      className="group-hover:shadow-sd"
                                      alt="autocompleImg"
                                      src={product.image}
                                      width={120}
                                      height={40}
                                      priority
                                    ></Image>
                                  </div>
                                  <span
                                    key={product.productId}
                                    className="cursor-pointer text-left"
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
                </Suspense>
              </>
            )}
        </div>
        <ul
          className={`justify-end items-center md:col-span-5 xl:col-span-4 max-md:hidden flex`}
        >
          {!pathName.includes("login") &&
            !pathName.includes("register") &&
            !pathName.includes("forgot-password") && (
              <>
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
                          <Link
                            href="/login"
                            className="w-full h-full"
                            as={"/login"}
                          >
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
                              <span className="truncate pl-2">
                                Tài khoản của tôi
                              </span>
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
                              <span className="truncate px-2">
                                Tài khoản của tôi
                              </span>
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
                          <CartDropdown
                            userInfo={info!}
                            userCart={cartItems}
                          ></CartDropdown>
                        </div>
                      </Paper>
                    }
                    buttonChildren={
                      <Link href="/cart">
                        <div
                          onClick={(e: any) => {
                            if (!info) {
                              e.preventDefault();
                              router.push("/login");
                              warningMessage("Vui lòng đăng nhập");
                            }
                          }}
                          className="flex flex-col gap-y-1 hover:opacity-60 transition-opacity"
                        >
                          <FontAwesomeIcon
                            className="relative text-white"
                            icon={faCartShopping}
                          ></FontAwesomeIcon>
                          <span className="text-white text-sm whitespace-nowrap">
                            Giỏ hàng
                          </span>
                        </div>
                        <div className="absolute -top-0.5 right-[12px] px-1.5 py-0.75 rounded-full text-white text-sm bg-secondary-color">
                          {info &&
                            cartItems &&
                            cartItems.length > 0 &&
                            cartItems.length}
                        </div>
                      </Link>
                    }
                  ></Menu>
                </li>
              </>
            )}
        </ul>
        {!pathName.includes("login") &&
          !pathName.includes("register") &&
          !pathName.includes("forgot-password") && (
            <div className="md:hidden col-span-2 grid place-items-end">
              <SwipeableTemporaryDrawer />
            </div>
          )}
      </div>
    </nav>
  );
};

export default TopNav;
