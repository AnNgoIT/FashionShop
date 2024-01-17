"use client";
import { imageLoader, theme } from "@/features/img-loading";
import { FormatPrice } from "@/features/product/FilterAmount";
import { diffInHours } from "@/features/product/date";
import { Product } from "@/features/types";
import Pagination from "@mui/material/Pagination";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BootstrapInput } from "./main-product";
import { ThemeProvider } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";

type ProductByCateProps = {
  productsByCate: Product[];
};

export const ProductByCate = (props: ProductByCateProps) => {
  const { productsByCate } = props;

  const [productByCateList, seProductByCateList] = useState(productsByCate);
  const [page, setPage] = useState(1);

  const [sortPrice, setSortPrice] = useState<string>("Giá");
  const [isActive, setIsActive] = useState<string>("Phổ biến");

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function handleSortPrice(e: any) {
    const value = e.target.value;
    setSortPrice(value);
    let sortProductList: Product[] = [];
    if (value == "Giá thấp nhất") {
      sortProductList = [...productByCateList].sort(
        (a, b) => a.priceMin - b.priceMin
      );
      seProductByCateList(sortProductList);
    } else if (value == "Giá cao nhất") {
      sortProductList = [...productByCateList].sort(
        (a, b) => b.priceMin - a.priceMin
      );
      seProductByCateList(sortProductList);
    } else {
      sortProductList = productByCateList;
    }
    seProductByCateList(sortProductList);
  }

  function handleSort(value: string) {
    setIsActive(value);
    if (productsByCate) {
      let sortProductList: Product[] = [];
      if (value == "Mới nhất") {
        sortProductList = [...productByCateList].sort(
          (a, b) => b.productId - a.productId
        );
      } else if (value == "Bán chạy") {
        sortProductList = [...productByCateList].sort(
          (a, b) => b.totalSold - a.totalSold
        );
      } else {
        sortProductList = productsByCate;
      }
      seProductByCateList(sortProductList);
    }
  }

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
      {/* <div className="container grid grid-cols-12 max-md:px-4  my-8">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12">
          <Carousel
            showStatus={false}
            showThumbs={false}
            transitionTime={100}
            autoPlay={true}
            infiniteLoop={true}
            renderIndicator={MyIndicator}
            showArrows={false}
            className="grid grid-flow-col col-span-full"
          >
            <div className="outline-1 outline outline-border-color group-hover:outline-none h-[16rem] md:h-[24rem]">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-full w-full"
                alt="productImage"
                src={sale_banner3}
                width={1350}
                height={320}
              ></Image>
            </div>
            <div className="outline-1 outline outline-border-color group-hover:outline-none h-[16rem] md:h-[24rem]">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-full w-full"
                alt="productImage"
                src={sale_banner4}
                width={1350}
                height={320}
              ></Image>
            </div>
            <div className="outline-1 outline outline-border-color group-hover:outline-none h-[16rem] md:h-[24rem]">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-full w-full"
                alt="productImage"
                src={sale_banner5}
                width={1350}
                height={320}
              ></Image>
            </div>
          </Carousel>
        </div>
      </div> */}
      <section className="container grid grid-cols-12 max-md:px-4 p-4 my-8">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
          <ul className="col-span-full md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-[30px] h-fit">
            <div
              className="col-span-full bg-[#f5f5f5] text-base text-text-color py-4 rounded-sm flex items-center px-4
                shadow-md truncate"
            >
              <span className="hidden md:block">Sắp xếp theo</span>
              <div className="ml-2 flex gap-x-2 truncate">
                <button
                  title="Phổ biến"
                  onClick={() => handleSort("Phổ biến")}
                  className={`${
                    isActive === "Phổ biến"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Phổ biến
                </button>
                <button
                  title="Mới nhất"
                  onClick={() => handleSort("Mới nhất")}
                  className={`${
                    isActive === "Mới nhất"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Mới nhất
                </button>
                <button
                  title="Bán chạy"
                  onClick={() => handleSort("Bán chạy")}
                  className={`${
                    isActive === "Bán chạy"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
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
                      value={sortPrice}
                      onChange={handleSortPrice}
                      input={<BootstrapInput />}
                    >
                      <MenuItem value={"Giá"}>Giá</MenuItem>
                      <MenuItem value={"Giá thấp nhất"}>Giá thấp nhất</MenuItem>
                      <MenuItem value={"Giá cao nhất"}>Giá cao nhất</MenuItem>
                    </Select>
                  </FormControl>
                </ThemeProvider>
              </div>
            </div>
            <div
              className="col-span-full bg-[#f5f5f5] text-lg text-text-color py-4 rounded-sm flex items-center px-4
                shadow-md"
            >
              Kết quả tìm kiếm : {productByCateList.length}
            </div>
            {productByCateList && productByCateList.length > 0 ? (
              productByCateList
                .slice((page - 1) * 4, (page - 1) * 4 + 4)
                .map((product: Product) => {
                  return (
                    <li
                      className={`group transition-all hover:cursor-pointer hover:shadow-hd col-span-1`}
                      key={product.productId}
                    >
                      <div className="relative outline outline-1 outline-border-color group-hover:outline-none">
                        {diffInHours(
                          new Date(product.createdAt!),
                          new Date()
                        ) <= 72 && (
                          <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[1rem] uppercase text-white bg-primary-color">
                            Mới
                          </label>
                        )}
                        {product.priceMin != product.promotionalPriceMin && (
                          <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[1rem] uppercase text-white bg-secondary-color">
                            Giảm{" "}
                            {`${Math.round(
                              ((product.priceMin -
                                product.promotionalPriceMin) /
                                product.priceMin) *
                                100
                            )}%`}
                          </label>
                        )}
                        <Link href={`/product/${product.productId}`}>
                          {product.image ? (
                            <>
                              <Image
                                loader={imageLoader}
                                priority
                                alt="productImage"
                                src={product.image}
                                // crop="fill"
                                width={500}
                                height={500}
                                // sizes="50vw"
                              ></Image>
                              <div className="relative w-full">
                                <div className="px-2 py-1">
                                  <p className="text-text-color text-base pt-[10px] truncate font-medium">
                                    {product.name}
                                  </p>
                                  <div className="text-text-light-color font-bold truncate">
                                    <span className="text-primary-color">
                                      {FormatPrice(product.promotionalPriceMin)}{" "}
                                      VNĐ
                                    </span>
                                    {product.priceMin !=
                                      product.promotionalPriceMin && (
                                      <span className="line-through ml-2 text-sm">
                                        {FormatPrice(product.priceMin)} VNĐ
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <Skeleton
                              sx={{
                                height: { sx: 225, md: 307 },
                                width: { sx: 225, md: 307 },
                              }}
                              animation="wave"
                              variant="rectangular"
                            />
                          )}
                        </Link>
                      </div>
                    </li>
                  );
                })
            ) : (
              <div className="col-span-full text-center text-3xl p-4 text-secondary-color h-[10rem]">
                No Products Found
              </div>
            )}
            {productByCateList.length > 0 && (
              <div className="col-span-full bg-background-color p-4 outline-none grid place-items-center">
                <Pagination
                  shape="rounded"
                  count={Math.ceil(productByCateList.length / 4)}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  size="large"
                  color="primary"
                />
              </div>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};
