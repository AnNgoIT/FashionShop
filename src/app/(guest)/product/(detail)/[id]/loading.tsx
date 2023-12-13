"use client";
import { QuantityButton } from "@/components/button";
import usePath from "@/hooks/usePath";
import {
  faBagShopping,
  faCheck,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import React from "react";

const ProductDetailLoading = () => {
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
      <section className="container grid grid-cols-12 mt-8 md:mt-12 max-lg:px-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
          <div className="col-span-full md:col-span-5 lg:col-span-4 lg:col-start-2 h-fit">
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%", marginBottom: "0.75rem" }}
              height={400}
            />
            <div className="flex gap-x-1">
              {[1, 2, 3].map((skeleton) => {
                return (
                  <Skeleton
                    key={skeleton}
                    variant="rectangular"
                    width={141}
                    height={141}
                  />
                );
              })}
            </div>
          </div>
          <div className={`col-span-full md:col-span-7 lg:col-span-5`}>
            <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
              <Skeleton variant="rectangular" width={546} height={60} />
            </h3>
            <div className="flex gap-x-4 py-2">
              <Skeleton variant="rectangular" width={150} height={24} />
            </div>
            <h1 className="text-primary-color font-bold">
              <Skeleton variant="rectangular" width={150} height={24} />
            </h1>
            <ul className=" border-b border-border-color text-base py-4">
              <Skeleton variant="rectangular" width={216} height={28} />

              <Skeleton variant="rectangular" width={216} height={28} />

              <Skeleton variant="rectangular" width={216} height={28} />
            </ul>
            <ul className="flex items-center gap-2 py-4 border-b border-border-color text-base">
              <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
              <Skeleton variant="rectangular" width={40} height={40} />
              <Skeleton variant="rectangular" width={40} height={40} />
              <Skeleton variant="rectangular" width={40} height={40} />
            </ul>
            <ul className="flex items-center gap-2 py-4 border-b border-border-color text-base">
              <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
              <Skeleton variant="rectangular" width={40} height={40} />
              <Skeleton variant="rectangular" width={40} height={40} />
              <Skeleton variant="rectangular" width={40} height={40} />
            </ul>

            <div
              className={`flex items-center gap-2 py-4 border-b border-border-color`}
            >
              <span className="text-md mr-2 min-w-[5rem]">Số lượng:</span>
              <QuantityButton>
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              </QuantityButton>
              <input
                className="outline outline-1 outline-border-color w-10 py-1.5 text-center text-text-color focus:outline-primary-color"
                defaultValue={1}
                required
                type="text"
              />
              <QuantityButton>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </QuantityButton>
              <Skeleton variant="rectangular" width={80} height={20} />
            </div>
            <div className="pt-5 flex">
              <button
                className="rounded-[4px] bg-primary-color text-white px-4 py-3 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200  text-ellipsis whitespace-nowrap"
              >
                <FontAwesomeIcon
                  className="pr-2 text-[20px]"
                  icon={faBagShopping}
                ></FontAwesomeIcon>
                Thêm vào giỏ hàng
              </button>
              <button
                className="rounded-[4px] bg-primary-color text-white px-[15px] py-[11px] 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200 ml-6  text-ellipsis whitespace-nowrap"
              >
                <FontAwesomeIcon
                  className="pr-2 text-[20px]"
                  icon={faCheck}
                ></FontAwesomeIcon>
                Mua hàng ngay
              </button>
            </div>
          </div>
        </div>
        <div
          className={`col-span-full lg:col-span-10 lg:col-start-2 grid grid-cols-12 gap-x-[30px] py-16`}
        >
          <div className="col-span-full grid place-items-center">
            <CircularProgress />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailLoading;
