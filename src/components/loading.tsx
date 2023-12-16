"use client";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import React from "react";
import NavigateButton from "./button";
import usePath from "@/hooks/usePath";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { imageLoader, theme } from "@/features/img-loading";
import Select from "@mui/material/Select";
import { BootstrapInput } from "@/container/product/main-product";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Image from "next/image";
import { sale_banner2 } from "@/assests/images";
import Pagination from "@mui/material/Pagination";
const ProductLoading = ({ title }: { title: string }) => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">{title}</span>
        </div>
        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item: number) => {
            return (
              <li className={`group`} key={item}>
                <div className="relative">
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: "100%",
                      height: { xs: 205, md: 235, lg: 305 },
                    }}
                  />
                  <div className="relative w-full">
                    <div className="py-1">
                      <p
                        className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                 text-ellipsis whitespace-nowrap "
                      >
                        <Skeleton
                          variant="rectangular"
                          sx={{ width: "100%", marginBottom: "10px" }}
                          height={20}
                        ></Skeleton>
                      </p>
                      <div className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                        <Skeleton
                          variant="rectangular"
                          sx={{ width: "100%" }}
                          height={18}
                        ></Skeleton>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div
          className={`font-sans col-span-full flex justify-center items-center`}
        >
          <Link href="/product">
            <NavigateButton>Xem thêm</NavigateButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

const RelatedProductLoading = ({ title }: { title: string }) => {
  return (
    <>
      <div className={`col-span-full text-center mb-4 md:mb-8`}>
        <span className="product-title">{title}</span>
      </div>
      <ul className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-[30px] h-fit mb-8">
        {[1, 2, 3, 4].map((item: number) => {
          return (
            <li className={`group col-span-1`} key={item}>
              <div className="relative">
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "100%",
                    height: { xs: 205, md: 235, lg: 305 },
                  }}
                />
                <div className="relative w-full">
                  <div className="py-1">
                    <p
                      className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                 text-ellipsis whitespace-nowrap "
                    >
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: "100%", marginBottom: "10px" }}
                        height={20}
                      ></Skeleton>
                    </p>
                    <div className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: "100%" }}
                        height={18}
                      ></Skeleton>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const CategoryLoading = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Danh Mục Sản Phẩm</span>
        </div>
        <div className="col-span-full grid place-items-center">
          <CircularProgress />
        </div>
      </div>
    </section>
  );
};

const LoadingComponent = () => {
  return (
    <div className="container grid grid-cols-12 py-4 max-md:px-4 mt-8 md:mt-12 h-[100vh]">
      <div className="col-span-full grid place-items-center">
        <CircularProgress />
      </div>
    </div>
  );
};

const MainProductLoading = () => {
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];

  return (
    <>
      <main className="font-montserrat bg-white mt-[76px] md:mt-[80px] lg:mt-[96px] relative z-0">
        <section className="lg:container border-white bg-background px-8 py-4 rounded-md max-md:rounded-none">
          <div className={`grid grid-cols-1`}>
            <div className="flex items-center justify-center flex-col lg:flex-row lg:justify-between ">
              <span className="text-2xl leading-[30px] tracking-[1px] uppercase font-semibold text-text-color mb-[10px] lg:mb-0">
                {title}
              </span>
              <ul className="flex">
                {urlLink &&
                  urlLink?.map((value: string, index: number) => {
                    const nextLink = urlLink![index + 1];
                    let thisLink = null;
                    if (nextLink !== undefined && value !== "home") {
                      thisLink = (
                        <>
                          <Link
                            className="group-hover:cursor-pointer group-hover:text-secondary-color
                transition-all duration-200 capitalize text-[18px]"
                            href={`/${value}`}
                          >
                            {value}
                          </Link>
                          <span className="px-[10px]">/</span>
                        </>
                      );
                    } else if (value === "home") {
                      thisLink = (
                        <>
                          <Link
                            className="group-hover:cursor-pointer group-hover:text-secondary-color
                transition-all duration-200 capitalize text-[18px]"
                            href={`/`}
                          >
                            {value}
                          </Link>
                          <span className="px-[10px]">/</span>
                        </>
                      );
                    } else
                      thisLink = (
                        <span className="capitalize text-[18px]">{value}</span>
                      );
                    return (
                      <li
                        key={index}
                        className={`font-medium ${nextLink ? `group` : ``}`}
                      >
                        {thisLink}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <section className="container grid grid-cols-12 max-md:px-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
          <div className="col-span-full my-10 h-max">
            <Box
              sx={{
                maxHeight: {
                  xs: 180,
                  sm: 350,
                  md: 450,
                  lg: 550,
                },
                height: 250,
                width: ["100%", "100%"],
              }}
            >
              <Image
                loader={imageLoader}
                src={sale_banner2}
                alt="saleBanner2"
                placeholder="blur"
                className="w-full h-full rounded-lg"
                width={1350}
                height={250}
              />
            </Box>
          </div>
          <div className="col-span-full lg:col-span-3 grid justify-center items-start mt-2">
            <CircularProgress />
          </div>
          <ul className="col-span-full lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-[30px] h-fit">
            <div
              className="col-span-full bg-[#f5f5f5] text-base text-text-color py-4 rounded-sm flex items-center px-4
              shadow-md"
            >
              <span className="hidden md:block">Sắp xếp theo</span>
              <div className="ml-2 flex gap-x-2">
                <button
                  className={`bg-primary-color text-white
                  px-4 py-2 text-base  transition-all rounded-sm truncate`}
                >
                  Phổ biến
                </button>
                <button
                  className={`bg-white px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Mới nhất
                </button>
                <button
                  className={`bg-white px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Bán chạy
                </button>
                <ThemeProvider theme={theme}>
                  <FormControl
                    sx={{
                      width: ["6rem", "9.5rem"],
                      background: "white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    // variant="standard"
                  >
                    <Select
                      id="sort-id"
                      name="price"
                      defaultValue={"Giá"}
                      input={<BootstrapInput />}
                    >
                      <MenuItem value={"Giá"}>Giá</MenuItem>
                    </Select>
                  </FormControl>
                </ThemeProvider>
              </div>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item: number) => {
              return (
                <li className={`group`} key={item}>
                  <div className="relative">
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: "100%",
                        height: { xs: 205, md: 235, lg: 305 },
                      }}
                    />
                    <div className="relative w-full">
                      <div className="py-1">
                        <p
                          className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                 text-ellipsis whitespace-nowrap "
                        >
                          <Skeleton
                            variant="rectangular"
                            sx={{ width: "100%", marginBottom: "10px" }}
                            height={20}
                          ></Skeleton>
                        </p>
                        <div className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                          <Skeleton
                            variant="rectangular"
                            sx={{ width: "100%" }}
                            height={18}
                          ></Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            <div className="col-span-full bg-background-color p-4 outline-none grid place-items-center">
              <Pagination
                shape="rounded"
                count={Math.ceil(22 / 9)}
                page={1}
                variant="outlined"
                size="large"
                color="primary"
              />
            </div>
          </ul>
        </div>
      </section>
    </>
  );
};

export {
  CategoryLoading,
  ProductLoading,
  LoadingComponent,
  MainProductLoading,
  RelatedProductLoading,
};
