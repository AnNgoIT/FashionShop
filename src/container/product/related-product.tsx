import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import { FormatPrice } from "@/features/product/FilterAmount";

import {
  MyLeftArrow,
  MyRightArrow,
  imageLoader,
  responsive,
} from "@/features/img-loading";
import { Product } from "@/features/types";
import { diffInHours } from "@/features/product/date";

type RelateProductProps = {
  relatedProduct: Product[];
};

const RelatedProduct = (props: RelateProductProps) => {
  const productList: Product[] = props.relatedProduct;

  return (
    <>
      <div className={`col-span-full text-center mb-4 md:mb-8`}>
        <span className="product-title">related products</span>
      </div>
      <div className="col-span-full grid-cols-12">
        <Carousel
          swipeable={true}
          draggable={false}
          ssr={true}
          responsive={responsive}
          autoPlay={true}
          infinite={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          transitionDuration={500}
          deviceType={"desktop"}
          customLeftArrow={<MyLeftArrow />}
          customRightArrow={<MyRightArrow />}
          itemClass="carousel-item"
        >
          {productList &&
            productList.length > 0 &&
            productList.map((product: Product) => {
              return (
                <div
                  className={`group transition-all hover:cursor-pointer hover:shadow-lg`}
                  key={product.productId}
                >
                  <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
                    {diffInHours(new Date(product.createdAt!), new Date()) <=
                      72 && (
                      <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                        Mới
                      </label>
                    )}
                    {product.priceMin != product.promotionalPriceMin && (
                      <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                        Giảm giá
                      </label>
                    )}
                    <Link href={`/product/${product.productId}`}>
                      <Image
                        loader={imageLoader}
                        blurDataURL={product.image}
                        placeholder="blur"
                        className="group-hover:shadow-lg"
                        alt="productImage"
                        src={product.image}
                        width={500}
                        height={500}
                      ></Image>
                    </Link>
                  </div>
                  <div className="relative w-full">
                    <div className="px-2 py-1">
                      <p
                        className="text-text-color text-base pt-2.5 overflow-hidden font-medium
                   text-ellipsis whitespace-nowrap "
                      >
                        {product.name}
                      </p>
                      <h3 className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                        {product && FormatPrice(product.promotionalPriceMin)}{" "}
                        VNĐ
                        {product &&
                          product.priceMin != product.promotionalPriceMin && (
                            <span className="line-through text-text-light-color ml-2 text-sm">
                              {FormatPrice(product.priceMin)} VNĐ
                            </span>
                          )}
                      </h3>
                    </div>
                    <div className="absolute top-0 left-0 right-0 w-full h-full">
                      <ul
                        className="bg-[#f5f5f5] group-hover:flex group-hover:animate-appear 
                                    justify-center items-center h-full hidden"
                      >
                        <li
                          className="border-r border-[#c6c6c6]
                                    px-2.5 h-[1.25rem]"
                        >
                          <div>
                            <Link href="/cart">
                              <FontAwesomeIcon
                                className="text-xl hover:text-primary-color transition-all"
                                icon={faBagShopping}
                              />
                            </Link>
                          </div>
                        </li>
                        <li className="px-2.5 h-[1.25rem]">
                          <div>
                            <Link href="/wishlist">
                              <FontAwesomeIcon
                                className="text-xl hover:text-primary-color transition-all"
                                icon={faHeart}
                              />
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
        </Carousel>
      </div>
    </>
  );
};

export default RelatedProduct;
