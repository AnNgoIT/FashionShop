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
import { product_1, product_2, product_3 } from "@/assests/images";

import {
  MyLeftArrow,
  MyRightArrow,
  imageLoader,
  responsive,
} from "@/features/img-loading";

const RelatedProduct = ({ categoryId }: any) => {
  const productList: ProductDetail[] = [];
  // function getInitialProps({ req }: any) {
  //   let userAgent;
  //   let deviceType;
  //   if (req) {
  //     userAgent = req.headers["user-agent"];
  //   } else {
  //     userAgent = navigator.userAgent;
  //   }
  //   const md = new MobileDetect(userAgent);
  //   if (md.tablet()) {
  //     deviceType = "tablet";
  //   } else if (md.mobile()) {
  //     deviceType = "mobile";
  //   } else {
  //     deviceType = "desktop";
  //   }
  //   return { deviceType };
  // }

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
                      className="text-text-color text-base pt-2.5 overflow-hidden font-medium
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
          <div
            className={`group transition-all hover:cursor-pointer hover:shadow-lg`}
            key={6}
          >
            <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
              <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                New
              </label>
              <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                Sale
              </label>
              <Link href={`/product/${6}`}>
                <Image
                  loader={imageLoader}
                  placeholder="blur"
                  className="group-hover:shadow-lg"
                  alt="productImage"
                  src={product_2}
                  width={500}
                  height={0}
                ></Image>
              </Link>
            </div>
            <div className="relative w-full">
              <div className="px-2 py-1">
                <p
                  className="text-text-color text-base pt-2.5 overflow-hidden font-medium
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
          <div
            className={`group transition-all hover:cursor-pointer hover:shadow-lg`}
            key={7}
          >
            <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
              <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                New
              </label>
              <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                Sale
              </label>
              <Link href={`/product/${7}`}>
                <Image
                  loader={imageLoader}
                  placeholder="blur"
                  className="group-hover:shadow-lg"
                  alt="productImage"
                  src={product_3}
                  width={500}
                  height={0}
                ></Image>
              </Link>
            </div>
            <div className="relative w-full">
              <div className="px-2 py-1">
                <p
                  className="text-text-color text-base pt-2.5 overflow-hidden font-medium
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
        </Carousel>
      </div>
    </>
  );
};

export default RelatedProduct;
