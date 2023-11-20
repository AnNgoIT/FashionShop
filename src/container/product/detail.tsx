"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCheck,
  faHeart,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FormatPrice, MaxAmounts } from "@/features/product/FilterAmount";
import {
  MyLeftArrow,
  MyRightArrow,
  defaulResponsive,
} from "@/features/img-loading";
import { QuantityButton } from "@/components/button";
import RelatedProduct from "@/container/product/related-product";
import ContentSwitcher from "@/container/product/content-switcher";
import ImageMagnifier from "@/components/image-magnifier";
import Carousel from "react-multi-carousel";
import { useAllProducts, useProductDetail } from "@/hooks/useProducts";
import { Product } from "@/features/types";
import LoadingComponent from "@/components/loading";
import { GetStaticPaths } from "next";
import usePath from "@/hooks/usePath";

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];

  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(380000);
  const [isSizeActive, setSizeActive] = useState<string[]>([]);
  const [isColorActive, setColorActive] = useState<string[]>([]);

  const { productDetail, isProductDetailError, isProductDetailLoading } =
    useProductDetail(params.id);
  if (isProductDetailLoading) return <LoadingComponent />;
  if (isProductDetailError) return <div>Failed to Load</div>;

  const detail: Product = productDetail && productDetail.result;
  const sizeList = detail.styleValues.filter(
    (value) => value.style.name == "Size"
  );
  const colorList = detail.styleValues.filter(
    (value) => value.style.name == "Color"
  );
  function handleSizeList(size: string) {
    let newSize: string[] = [];
    newSize.push(size);
    setSizeActive(newSize);
  }

  function handleColorList(color: string) {
    let newColor: string[] = [];
    newColor.push(color);
    setColorActive(newColor);
  }

  function increasePriceBySize(increase: number) {
    setPrice(380000 + increase);
  }

  const handleClick = (event: any) => {
    event.target.select(); // Bôi đen toàn bộ giá trị khi click vào input
  };
  const handleChangeQuantity = (amount: number) => {
    if (amount === -1 && qty === 1 && !isNaN(amount)) {
      return;
    }
    setQty((qty: number) => {
      const newQty = qty + amount;
      return MaxAmounts(newQty, 20) ? newQty : 20;
    });
  };
  const handleChangeQuantityByKeyBoard = (qty: number) => {
    if (isNaN(qty)) {
      return;
    } else if (!qty) {
      setQty(0);
    }
    setQty(MaxAmounts(qty, 20) ? qty : 20);
  };

  return (
    <>
      <main className="font-montserrat min-h-[62.5rem] bg-white mt-[6rem] relative z-0">
        <section className="lg:container lg:border-y-[10px] border-white bg-background py-16 md:py-28 px-8">
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
      <section className="container grid grid-cols-12 mt-8 md:mt-12 p-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
          <div className="col-span-full md:col-span-5 lg:col-span-4 lg:col-start-2 outline outline-1 outline-border-color h-fit">
            <Carousel
              swipeable={true}
              draggable={true}
              ssr={true}
              responsive={defaulResponsive}
              infinite={true}
              keyBoardControl={true}
              customLeftArrow={<MyLeftArrow />}
              customRightArrow={<MyRightArrow />}
              deviceType={"desktop"}
              itemClass="carousel-item"
            >
              <ImageMagnifier
                src={detail.image}
                bgImg={detail.image}
                height={480}
                zoomLevel={2.5}
              ></ImageMagnifier>
            </Carousel>
          </div>
          <div className={`col-span-full md:col-span-7 lg:col-span-5`}>
            <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
              {detail && detail.name}
            </h3>
            <h1 className="text-primary-color font-bold">
              {detail && FormatPrice(detail.promotionalPriceMin)} VNĐ
              {detail && detail.priceMin != detail.promotionalPriceMin && (
                <span className="line-through text-text-light-color ml-2 text-sm">
                  {FormatPrice(price)} VNĐ
                </span>
              )}
            </h1>
            <ul className=" border-b-[1px] border-border-color text-base py-4">
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Chính sách bảo hành chất lượng</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Giá cả hợp lý</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Giao hàng nhanh chóng tiện lợi</p>
              </li>
            </ul>
            <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
              <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
              {sizeList &&
                sizeList.length &&
                sizeList.map((item) => {
                  return (
                    <li
                      onClick={() => {
                        handleSizeList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all
                              ${
                                isSizeActive.includes(item.name)
                                  ? " bg-primary-color text-white"
                                  : ""
                              }`}
                    >
                      {item.name}
                    </li>
                  );
                })}
            </ul>
            <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
              <span className="text-md mr-2 min-w-[5rem]">Colors:</span>
              {colorList &&
                colorList.map((item) => {
                  return (
                    <li
                      onClick={() => {
                        handleColorList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all
                              ${
                                isColorActive.includes(item.name)
                                  ? " bg-primary-color text-white"
                                  : ""
                              }`}
                    >
                      {item.name}
                    </li>
                  );
                })}
            </ul>
            <div
              className={`flex items-center gap-2 py-4 border-b-[1px] border-border-color`}
            >
              <span className="text-md mr-2 min-w-[5rem]">Quantity:</span>
              <QuantityButton onClick={() => handleChangeQuantity(-1)}>
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              </QuantityButton>
              <input
                onChange={(e) =>
                  handleChangeQuantityByKeyBoard(+e.target.value)
                }
                onFocus={handleClick}
                className="outline outline-1 outline-border-color w-10 py-1.5 text-center text-text-color focus:outline-primary-color"
                value={qty}
                min={1}
                max={20}
                required
                type="text"
              />
              <QuantityButton onClick={() => handleChangeQuantity(1)}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </QuantityButton>
              <span className="pl-6">{detail.quantity} products available</span>
            </div>

            <div className="pt-5 flex">
              <Link href="/cart">
                {/* onClick ={" "}
                  {() => {
                    handleAddToCart(item.id);
                  }} */}
                <button
                  className="rounded-[4px] bg-primary-color text-white px-4 py-3 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200  text-ellipsis whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    className="pr-2 text-[20px]"
                    icon={faBagShopping}
                  ></FontAwesomeIcon>
                  Add to cart
                </button>
              </Link>
              <Link href="/wishlist">
                <button
                  className="rounded-[4px] bg-primary-color text-white px-[15px] py-[11px] 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200 ml-6  text-ellipsis whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    className="pr-2 text-[20px]"
                    icon={faHeart}
                  ></FontAwesomeIcon>
                  Add to wishlist
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px] py-16`}
        >
          <ContentSwitcher description={detail.description}></ContentSwitcher>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px]`}
        >
          <RelatedProduct
            categoryId={detail.category.categoryId}
          ></RelatedProduct>
        </div>
      </section>
    </>
  );
};
export default ProductDetail;
