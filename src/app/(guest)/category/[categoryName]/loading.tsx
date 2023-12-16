"use client";
import { theme } from "@/features/img-loading";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import FormControl from "@mui/material/FormControl";
import Skeleton from "@mui/material/Skeleton";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { BootstrapInput } from "@/container/product/main-product";

const loading = () => {
  return (
    <>
      <main className="font-montserrat bg-white mt-[76px] lg:mt-[96px] relative z-0">
        <section className="lg:container border-white bg-background px-8 py-4 rounded-md max-md:rounded-none">
          <Breadcrumbs maxItems={2} aria-label="breadcrumb">
            <Link
              href="/"
              className="flex items-center text-lg text-text-color p-2 hover:text-secondary-color hover:cursor-pointer transition-colors"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Link
              href="/product"
              className="flex items-center text-lg text-text-color p-2 hover:text-secondary-color hover:cursor-pointer transition-colors"
            >
              <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Category
            </Link>
          </Breadcrumbs>
        </section>
      </main>
      <section className="container grid grid-cols-12 max-md:px-4 my-8">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
          <ul className="col-span-full md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-[30px] h-fit">
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
            <div
              className="col-span-full bg-[#f5f5f5] text-lg text-text-color py-4 rounded-sm flex items-center px-4
                    shadow-md"
            >
              Kết quả tìm kiếm :
            </div>
            {[1, 2, 3, 4].map((item: number) => {
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
        </div>
      </section>
    </>
  );
};

export default loading;
