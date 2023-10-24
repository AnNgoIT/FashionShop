"use client";
// import usePath from "@/hooks/usePath";
import {
  faBagShopping,
  faClose,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import React, { useContext, useState } from "react";
// import { FormatPrice } from "@/containers/HomePage/Product";
// import { sidebar_banner } from "@/static/productBanner/StaticFile";
// import Pagination from "@/containers/Product/Pagination";
// import axios from "axios";
import { FormatPrice } from "@/features/product/FilterAmount";
import { ProductDetail } from "@/features/product";
import { main_banner1, product_1 } from "@/assests/images";
import { imageLoader } from "@/features/img-loading";
// import {
//   useProducts,
//   useProductsPagination,
// } from "@/hooks/Product/useProducts";
type Category = {
  id: number;
  name: string;
};
type Brand = Category;
const ProductPage = ({ data }: any) => {
  // const path = usePath();

  const [pageIndex, setPageIndex] = useState(1);
  const categoryList: Category[] = [];
  const productList: ProductDetail[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];
  const brandList: number[] = [1];
  const latestProductList: ProductDetail[] = [];
  return (
    <section className="container grid grid-cols-12 p-4 md:p-8 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
        <div className="col-span-full md:col-span-12 lg:col-span-3 grid gap-y-[30px] mb-5">
          <div className="bg-[#f5f5f5] p-5 shadow-[0_3px_10px_0_rgba(0,0,0,.1)]">
            <h2
              className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0] mb-5`}
            >
              CATEGORIES
            </h2>
            <ul>
              {categoryList &&
                categoryList.length &&
                categoryList.map((category: Category) => {
                  return (
                    <li
                      className={`py-2 text-[#999] text-[16px] font-normal 
                                tracking-[0] leading-[24px] hover:text-primary-color transition-all duration-200
                                ${
                                  category !==
                                  categoryList[categoryList.length - 1]
                                    ? "border-b-[1px] border-[#e5e5e5]"
                                    : ""
                                }`}
                      key={category.id}
                    >
                      <Link href={`/category/${category.name}`}>
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="bg-[#f5f5f5] p-5 shadow-[0_3px_10px_0_rgba(0,0,0,.1)]">
            <h2
              className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0] mb-5`}
            >
              FILTER BY
            </h2>
            <article
              className="bg-primary-color py-[8px] px-[15px] w-fit rounded-[5px] text-[13px] 
                            transition-all duration-200  hover:bg-text-color cursor-pointer font-medium mb-5 text-white"
            >
              <FontAwesomeIcon
                className="mr-1"
                icon={faClose}
              ></FontAwesomeIcon>
              <button className="">Clear all</button>
            </article>
            <article>
              <h2 className="underline font-semibold text-text-color">Price</h2>
              <ul className="text-text-color">
                <li className="flex items-center py-1.5 border-b-[1px] border-[#e5e5e5]">
                  <input
                    type="checkbox"
                    className="py-[8px] px-[15px] bg-[#f8f8f8] mr-1 min-h-[18px] min-w-[18px]"
                  ></input>
                  <span className="text-[#999]">{`> ${FormatPrice(
                    900000
                  )} VNĐ`}</span>
                </li>
                <li className="flex items-center py-1.5 border-b-[1px] border-[#e5e5e5]">
                  <input
                    type="checkbox"
                    className="py-[8px] px-[15px] bg-[#f8f8f8] mr-1 min-h-[18px] min-w-[18px]"
                  ></input>
                  <span className="text-[#999]">{`> ${FormatPrice(
                    1200000
                  )} VNĐ`}</span>
                </li>
                <li className="flex items-center py-1.5">
                  <input
                    type="checkbox"
                    className="py-[8px] px-[15px] bg-[#f8f8f8] mr-1 min-h-[18px] min-w-[18px]"
                  ></input>
                  <span className="text-[#999]">{`> ${FormatPrice(
                    2000000
                  )} VNĐ`}</span>
                </li>
              </ul>
            </article>
            <article>
              <h2 className="underline font-semibold text-text-color">Brand</h2>
              <ul className="text-text-color">
                {brandList &&
                  brandList.length &&
                  brandList.map((brand: any, item) => {
                    return (
                      <li
                        className={`py-2 text-[#999] text-[14px] font-normal 
                                  tracking-[0] leading-[24px] hover:text-primary-color transition-all duration-200
                                  ${
                                    brand !== brandList[brandList.length - 1]
                                      ? "border-b-[1px] border-[#e5e5e5]"
                                      : ""
                                  }`}
                        key={`brand-${item}`}
                      >
                        <Link href={`/brand/${brand.name}`}>{brand.name}</Link>
                      </li>
                    );
                  })}
              </ul>
            </article>
            <ul></ul>
          </div>
          <div className="max-[991px]:hidden">
            <Image
              className="w-full"
              src={main_banner1}
              alt={"sidebarBanner"}
            ></Image>
          </div>
          <div className="bg-[#f5f5f5] p-5 shadow-[0_3px_10px_0_rgba(0,0,0,.1)]">
            <h2
              className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0] mb-5`}
            >
              LATEST PRODUCTS
            </h2>
            <ul className="flex flex-col">
              {latestProductList &&
                latestProductList.map((product: ProductDetail, item) => {
                  return (
                    <li className="py-[7px] mb-[5px]" key={item}>
                      <Image
                        className="w-[100px] pr-[15px] float-left"
                        src={product_1}
                        width={500}
                        height={500}
                        alt={"lastestProductImg"}
                      ></Image>
                      <article className="flex flex-col items-start min-[991px]:w-[130px] w-fit ">
                        <h2 className="truncate w-full text-text-color font-semibold">
                          {product.name}
                        </h2>
                        <span className="text-primary-color font-bold">{`${FormatPrice(
                          380000
                        )} VNĐ`}</span>
                        <Link
                          className="text-text-color font-semibold cursor-pointer hover:text-primary-color 
                                        transition-all duration-200"
                          href="/cart"
                        >
                          Add to cart
                        </Link>
                      </article>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <ul className="col-span-full md:col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-[30px] h-fit">
          {productList &&
            productList.length &&
            productList.map((product: ProductDetail) => {
              return (
                <li
                  className={`group transition-all hover:cursor-pointer hover:shadow-sd col-span-1`}
                  key={product.id}
                >
                  <div className="relative border border-border-color group-hover:border-none">
                    <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                      New
                    </label>
                    <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                      Sale
                    </label>
                    <Link href={`/product/${product.id}`}>
                      <Image
                        loader={imageLoader}
                        placeholder="blur"
                        priority
                        className="group-hover:shadow-sd"
                        alt="productImage"
                        src={product_1}
                        width={500}
                        height={0}
                      ></Image>
                    </Link>
                  </div>
                  <div className="relative w-full">
                    <div className="px-2 py-1">
                      <p
                        className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                     text-ellipsis whitespace-nowrap "
                      >
                        {/* {product.name} */}
                        Mens Full sleeves Collar Shirt
                      </p>
                      <h3 className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                        {FormatPrice(380000)} VNĐ
                        <span className="line-through text-text-light-color ml-2 text-sm">
                          {FormatPrice(420000)} VNĐ
                        </span>
                      </h3>
                    </div>
                    <div className="absolute top-0 left-0 right-0 w-full h-full">
                      <ul
                        className="bg-[#f5f5f5] group-hover:flex group-hover:animate-appear 
                                      justify-center items-center h-full hidden"
                      >
                        <li
                          className="border-r border-[#c6c6c6]
                                      px-[10px] h-[20px]"
                        >
                          <div>
                            <Link href="/cart">
                              <FontAwesomeIcon
                                className="text-[20px] hover:text-primary-color transition-all"
                                icon={faBagShopping}
                              />
                            </Link>
                          </div>
                        </li>
                        <li className="px-[10px] h-[20px]">
                          <div>
                            <Link href="/wishlist">
                              <FontAwesomeIcon
                                className="text-[20px] hover:text-primary-color transition-all"
                                icon={faHeart}
                              />
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          {/* <div className="col-span-full bg-background-color p-[15px] outline-none">
            <Pagination
              pageIndex={pageIndex}
              setIndex={setPageIndex}
              totalPages={totalPages}
              productList={productList}
            />
          </div> */}
        </ul>
      </div>
    </section>
  );
};

export default ProductPage;
