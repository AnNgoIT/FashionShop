import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import React from "react";
import NavigateButton from "./button";
import { CircularProgress } from "@mui/material";
const ProductLoading = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Sản Phẩm Bán Chạy</span>
        </div>

        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
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

export { CategoryLoading, ProductLoading };
