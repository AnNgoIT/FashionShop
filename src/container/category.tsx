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
        <ul className="col-span-full grid grid-cols-3 md:grid-cols-5 gap-1">
          {categories &&
            categories
              .filter((category) => category.parentName === null)
              .map((category) => {
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
                          // placeholder="blur"
                          priority
                          width={180}
                          height={100}
                          className="w-[6rem] h-[6rem] rounded-full"
                          alt="categoryImage"
                          src={category.image}
                        ></CldImage>
                      </div>
                      <p className="p-4 grid place-content-center">
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
