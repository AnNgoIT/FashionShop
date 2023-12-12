import { imageLoader } from "@/features/img-loading";
import { Category } from "@/features/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
const CategorySection = ({ categories }: { categories: Category[] }) => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Danh Mục Sản Phẩm</span>
        </div>
        <ul className="col-span-full grid grid-cols-4 md:grid-cols-7">
          {categories &&
            categories.map((category) => {
              return (
                <li
                  key={category.categoryId}
                  className=" text-text-color col-span-1 grid grid-cols-1 place-content-center
                     hover:cursor-pointer border border-[#F2F2F2] p-4 hover:shadow-hd"
                >
                  <Link href={`/category/${category.name}`}>
                    <div className="grid place-content-center">
                      <Image
                        loader={imageLoader}
                        priority
                        width={400}
                        height={0}
                        className="w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem] lg:w-[6rem] lg:h-[6rem] rounded-full"
                        alt="categoryImage"
                        src={category.image}
                      ></Image>
                    </div>
                    <p className="p-4 grid place-content-center truncate max-xl:hidden">
                      {category.name}
                    </p>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default CategorySection;
