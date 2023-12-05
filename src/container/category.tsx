import { imageLoader } from "@/features/img-loading";
import { Category } from "@/features/types";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";

const CategorySection = ({ categories }: { categories: Category[] }) => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Danh Mục Sản Phẩm</span>
        </div>
        <ul className="col-span-full grid grid-cols-4 md:grid-cols-7 gap-1">
          {categories &&
            categories.map((category) => {
              return (
                <Link
                  key={category.categoryId}
                  href={`/category/${category.name}`}
                >
                  <li
                    className="bg-background text-text-color col-span-1 grid grid-cols-1 place-content-center hover:opacity-70
                     hover:cursor-pointer outline outline-1 outline-border-color p-4"
                  >
                    <div className="grid place-content-center">
                      <CldImage
                        loader={imageLoader}
                        priority
                        width={400}
                        height={0}
                        className="w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem]  lg:w-[6rem] lg:h-[6rem] rounded-full"
                        alt="categoryImage"
                        src={category.image}
                      ></CldImage>
                    </div>
                    <p className="p-4 grid place-content-center truncate max-md:hidden">
                      {category.name}
                    </p>
                  </li>
                </Link>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default CategorySection;
