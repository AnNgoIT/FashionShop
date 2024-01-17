import React from "react";
import Image from "next/image";
import Link from "next/link";
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
      {productList && productList.length > 0 && (
        <>
          <div className={`col-span-full text-center mb-4 md:mb-8`}>
            <span className="product-title">Sản phẩm liên quan</span>
          </div>
          <div className="col-span-full mb-8">
            <Carousel
              swipeable={true}
              draggable={false}
              // ssr={true}
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
                      className={`group transition-all hover:cursor-pointer hover:shadow-hd col-span-3 p-2`}
                      key={product.productId}
                    >
                      <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
                        {diffInHours(
                          new Date(product.createdAt!),
                          new Date()
                        ) <= 72 && (
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
                            alt="productImage"
                            src={product.image}
                            className="h-full w-full"
                            width={500}
                            height={500}
                          ></Image>
                          <div className="relative w-full">
                            <div className="px-2 py-1">
                              <p className="text-text-color text-base pt-[10px] truncate font-medium">
                                {product.name}
                              </p>
                              <div className="text-text-light-color font-bold truncate">
                                <span className="text-primary-color">
                                  {FormatPrice(product.promotionalPriceMin)} VNĐ
                                </span>
                                {product.priceMin !=
                                  product.promotionalPriceMin && (
                                  <span className="line-through ml-2 text-sm">
                                    {FormatPrice(product.priceMin)} VNĐ
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </Carousel>
          </div>
        </>
      )}
    </>
  );
};

export default RelatedProduct;
