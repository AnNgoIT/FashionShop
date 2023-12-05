import React from "react";
import Image from "next/image";
import { imageLoader } from "@/features/img-loading";
import Link from "next/link";
import { FormatPrice } from "@/features/product/FilterAmount";
import { faBagShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavigateButton from "@/components/button";
import { preloadAllProducts, useAllProducts } from "@/hooks/useProducts";
import { Product } from "@/features/types";
import { diffInHours } from "@/features/product/date";
import Skeleton from "@mui/material/Skeleton";
import { CldImage } from "next-cloudinary";

preloadAllProducts();

const Products = () => {
  const { products, isProductsError, isProductsLoading } = useAllProducts();
  if (isProductsLoading)
    return (
      <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
        <div className="col-span-full grid grid-cols-12">
          <div className={`col-span-full text-center mb-4 md:mb-8`}>
            <span className="product-title">Sản Phẩm Bán Chạy</span>
          </div>
          <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
            {[1, 2, 3, 4].map((item) => {
              return (
                <li className={``} key={item}>
                  <div className="relative">
                    <div>
                      <Skeleton
                        variant="rectangular"
                        width={305.5}
                        height={305}
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    <div className="py-1 pt-2.5">
                      <Skeleton
                        sx={{ margin: "0.25rem 0" }}
                        variant="rounded"
                        width={306}
                        height={24}
                      ></Skeleton>
                      <h3 className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                        <Skeleton
                          sx={{ margin: "0.25rem 0" }}
                          variant="rounded"
                          width={305}
                          height={20}
                        ></Skeleton>
                      </h3>
                    </div>
                    <div className="absolute top-0 left-0 right-0 w-full h-full">
                      <ul className="bg-[#f5f5f5] hidden">
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
              <NavigateButton>Xem thêm</NavigateButton>
            </Link>
          </div>
        </div>
      </section>
    );
  if (isProductsError) return <div>Failed to Load</div>;

  const productList: Product[] = products && products.result.content;

  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Sản Phẩm Bán Chạy</span>
        </div>

        <ul className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-6">
          {productList && productList.length ? (
            productList.slice(0,4).map((product: Product) => {
              return (
                <li
                  className={`group transition-all hover:cursor-pointer hover:shadow-sd`}
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
                      <CldImage
                        loader={imageLoader}
                        // placeholder="blur"
                        priority
                        className="group-hover:shadow-sd"
                        alt="productImage"
                        src={product.image}
                        width={500}
                        height={500}
                      ></CldImage>
                    </Link>
                  </div>
                  <div className="relative w-full">
                    <div className="px-2 py-1">
                      <p
                        className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                     text-ellipsis whitespace-nowrap "
                      >
                        {product.name}
                      </p>
                      <h3 className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                        {FormatPrice(product.promotionalPriceMin)} VNĐ
                        {product.priceMin != product.promotionalPriceMin && (
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
            <Link href="/product">
              <NavigateButton>Xem thêm</NavigateButton>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
