import { ProductDetail } from "@/features/product";
import React from "react";
import Image from "next/image";
import { imageLoader } from "@/features/img-loading";
import Link from "next/link";
import { FormatPrice } from "@/features/product/FilterAmount";
import { faBagShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { product_1 } from "@/assests/images";
import NavigateButton from "@/components/button";
const Products = () => {
  const productList: ProductDetail[] = [{ id: 1 }, { id: 2 }];

  return (
    <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">featured products</span>
        </div>
        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
          {productList &&
            productList.length &&
            [1, 2, 3, 4, 5, 6, 7, 8].map((product: any) => {
              return (
                <li
                  className={`group transition-all hover:cursor-pointer hover:shadow-sd`}
                  key={product}
                >
                  <div className="relative border border-border-color group-hover:border-none">
                    <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                      New
                    </label>
                    <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                      Sale
                    </label>
                    <Link href={`/product/detail/${product}`}>
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
        </ul>
        <div
          className={`font-sans col-span-full flex justify-center items-center`}
        >
          <Link href="/product">
            <NavigateButton>See more Products</NavigateButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
