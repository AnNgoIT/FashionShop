import React from "react";
import { imageLoader } from "@/features/img-loading";
import Link from "next/link";
import { FormatPrice } from "@/features/product/FilterAmount";
import NavigateButton from "@/components/button";
import { Product } from "@/features/types";
import { diffInHours } from "@/features/product/date";
import Image from "next/image";
const Products = ({ products }: { products: Product[] }) => {
  const productList: Product[] = products;

  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Sản Phẩm Bán Chạy</span>
        </div>

        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
          {productList && productList.length ? (
            productList.slice(0, 4).map((product: Product) => {
              return (
                <li
                  className={`group transition-all hover:cursor-pointer hover:shadow-hd`}
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
                        // placeholder="blur"
                        priority
                        alt="productImage"
                        src={product.image}
                        width={500}
                        height={500}
                      ></Image>
                      <div className="relative w-full">
                        <div className="px-2 py-1">
                          <p
                            className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                     text-ellipsis whitespace-nowrap "
                          >
                            {product.name}
                          </p>
                          <div className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                            {FormatPrice(product.promotionalPriceMin)} VNĐ
                            {product.priceMin !=
                              product.promotionalPriceMin && (
                              <span className="line-through text-text-light-color ml-2 text-sm">
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
