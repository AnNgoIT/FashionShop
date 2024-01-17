import React from "react";
import { imageLoader } from "@/features/img-loading";
import Link from "next/link";
import { FormatPrice } from "@/features/product/FilterAmount";
import NavigateButton from "@/components/button";
import { Product } from "@/features/types";
import { diffInHours } from "@/features/product/date";
import Image from "next/image";
const Products = ({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) => {
  const productList: Product[] = products;

  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">{title}</span>
        </div>

        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
          {productList && productList.length > 0 ? (
            productList.slice(0, 8).map((product: Product) => {
              return (
                <li
                  className={`group transition-all hover:cursor-pointer hover:shadow-hd`}
                  key={product.productId}
                >
                  <div className="relative outline-1 outline outline-border-color group-hover:outline-none">
                    {diffInHours(new Date(product.createdAt!), new Date()) <=
                      72 && (
                      <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[1rem] uppercase text-white bg-primary-color">
                        Mới
                      </label>
                    )}

                    {product.priceMin != product.promotionalPriceMin && (
                      <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[1rem] uppercase text-white bg-secondary-color">
                        Giảm{" "}
                        {`${Math.round(
                          ((product.priceMin - product.promotionalPriceMin) /
                            product.priceMin) *
                            100
                        )}%`}
                      </label>
                    )}

                    <Link href={`/product/${product.productId}`}>
                      <Image
                        loader={imageLoader}
                        // placeholder="blur"
                        priority
                        alt="productImage"
                        src={product.image}
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
                </li>
              );
            })
          ) : (
            <div className="col-span-full text-center text-md p-4 text-secondary-color">
              Không tìm thấy sản phẩm
            </div>
          )}
        </ul>
        {productList && productList.length != 0 && (
          <div
            className={`font-sans col-span-full flex justify-center items-center`}
          >
            <Link href="/product" prefetch={true}>
              <NavigateButton>Xem thêm</NavigateButton>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
