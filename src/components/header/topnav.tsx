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
  transform: "translateX(-7px)",
  top: "56px",
  listStyle: "none",

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
  const [isPending, startTransition] = useTransition();
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
  const { cartItems, setCartItems } = useContext(CartContext);

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
            className="outline-none p-2 text-sm w-[7rem] truncate"
            type="text"
            placeholder="Search..."
          ></Input>
          <button
            onClick={() => onSearchValue(keyword)}
            type="submit"
            className="transition-opacity hover:opacity-60"
          >
            <FontAwesomeIcon className="icon" icon={faSearch}></FontAwesomeIcon>
          </button>
          {onSearch && keyword.length > 0 && (
            <Listbox
              key={"listbox"}
              sx={{
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
                  No Products Found
                </div>
              ) : (
                products.map((product) => {
                  return (
                    <li
                      onClick={() => onSearchValue(product.name)}
                      key={product.productId}
                      className="flex justify-between item-center px-2 py-3 max-h-[4.5rem] gap-x-2
                        hover:bg-primary-color hover:text-white cursor-pointer"
                    >
                      <CldImage
                        key={"image-" + product.productId}
                        loader={imageLoader}
                        priority
                        className="group-hover:shadow-sd"
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
                  );
                })
              )}
            </Listbox>
          )}
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
