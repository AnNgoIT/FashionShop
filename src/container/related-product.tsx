"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faChevronLeft,
  faChevronRight,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import { FormatPrice } from "@/features/product/FilterAmount";
import { ProductDetail } from "@/features/product";
import { product_1 } from "@/assests/images";
import { imageLoader } from "@/features/img-loading";
import dynamic from "next/dynamic";

const RelatedProduct = ({ categoryId }: any) => {
  const productList: ProductDetail[] = [];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1230 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1229, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
    },
  };
  const MyRightArrow = ({ onClick, ...rest }: any) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <div
        onClick={() => {
          onClick();
        }}
        className={`${
          true ? "group hover:bg-primary-color" : ""
        } myarrow right-0 translate-y-5 grid`}
      >
        <FontAwesomeIcon
          className="group-hover:text-white text-[17px] text-text-light-color"
          icon={faChevronRight}
        />
      </div>
    );
  };
  const MyLeftArrow = ({ onClick, ...rest }: any) => {
    const {
      onMove,
      carouselState: { currentSlide, deviceType },
    } = rest;
    // onMove means if dragging or swiping in progress.
    return (
      <div
        onClick={() => {
          onClick();
        }}
        className={`${
          true ? "group hover:bg-primary-color" : ""
        } myarrow left-0 translate-y-5 grid`}
      >
        <FontAwesomeIcon
          className="group-hover:text-white text-[17px] text-text-light-color"
          icon={faChevronLeft}
        />
      </div>
    );
  };
  return (
    <>
      <div className={`col-span-full text-center pb-6 pt-12`}>
        <span className="product-title">related products</span>
      </div>
      <div className="col-span-full grid-cols-12">
        <Carousel
          swipeable={true}
          draggable={false}
          responsive={responsive}
          autoPlay={true}
          infinite={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          customLeftArrow={<MyLeftArrow />}
          customRightArrow={<MyRightArrow />}
          // removeArrowOnDeviceType={["tablet", "mobile"]}
          itemClass="carousel-item"
        >
          {[1, 2, 3, 4, 5].map((item) => {
            return (
              <div
                className={`group transition-all hover:cursor-pointer hover:shadow-lg`}
                key={item}
              >
                <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
                  <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                    New
                  </label>
                  <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                    Sale
                  </label>
                  <Link href={`/product/${item}`}>
                    <Image
                      loader={imageLoader}
                      placeholder="blur"
                      className="group-hover:shadow-lg"
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
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default RelatedProduct;
