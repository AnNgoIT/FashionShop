import {
  // defaulResponsive3,
  defaulResponsive8,
  imageLoader,
} from "@/features/img-loading";
import { Category } from "@/features/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
const CategorySection = ({ categories }: { categories: Category[] }) => {
  return (
    <section className="container p-[15px] sm:pl-[10px] sm:pr-[9px] lg:p-[15px]">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Danh Mục Sản Phẩm</span>
        </div>
      </div>
      <Carousel
        swipeable={true}
        draggable={false}
        ssr={true}
        responsive={defaulResponsive8}
        // autoPlay={true}
        // infinite={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        transitionDuration={500}
        arrows={true}
        deviceType={"desktop"}
        containerClass="carousel-container"
        itemClass="carousel-item"
      >
        {categories &&
          categories.map((category) => {
            return (
              <div
                key={category.categoryId}
                className=" text-text-color col-span-1 grid grid-cols-1 place-content-center
                   hover:cursor-pointer border border-border-color p-4 hover:shadow-hd"
              >
                <Link href={`/category/${category.name}`}>
                  <div className="grid place-content-center">
                    <Image
                      loader={imageLoader}
                      priority
                      width={400}
                      height={0}
                      className="w-[6rem] h-[6rem] rounded-full
                       border-2 border-border-color"
                      alt="categoryImage"
                      src={category.image}
                    ></Image>
                  </div>
                  <p className="p-4 grid place-content-center truncate">
                    {category.name}
                  </p>
                </Link>
              </div>
            );
          })}
      </Carousel>
    </section>
  );
};

export default CategorySection;
