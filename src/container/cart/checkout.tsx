"use client";
import { product_2 } from "@/assests/images";
import { Total } from "@/features/cart/TotalPrice";
import { FormatPrice } from "@/features/product/FilterAmount";
import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/image";
import { CartContext } from "@/store";
import BillForm from "@/container/order/bill-form";
import usePath from "@/hooks/usePath";
import { cartItem } from "@/features/types";

export type OrderItem = {
  id: number;
  name?: string;
  price: number;
  quantity: number;
};

const Checkout = () => {
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const { cartItems } = useContext(CartContext);

  return (
    <>
      <main className="font-montserrat bg-white mt-[76px] relative z-0">
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
      <section className="container grid grid-cols-12 py-4 max-md:px-4 mt-8 md:mt-12">
        <div className="col-span-full grid grid-cols-12 gap-x-7">
          <div className={`col-span-full md:col-span-5 md:col-start-2`}>
            {true ? (
              <>
                <h1 className="text-xl font-semibold text-text-color mb-8 max-md:text-center">
                  Thông tin người mua
                </h1>
                <BillForm></BillForm>
              </>
            ) : (
              <h1 className="text-base ">
                You are not login.{" "}
                <Link href="/login">
                  <span className="text-primary-color font-semibold">
                    Login here
                  </span>
                </Link>
              </h1>
            )}
          </div>
          <div
            className={`col-span-full md:col-span-6 lg:col-span-4 lg:col-start-8`}
          >
            <h1 className="text-xl font-semibold text-text-color max-md:text-center">
              Đơn hàng
            </h1>
            <ul className="flex flex-col mb-[40px]">
              {cartItems &&
                cartItems.map((cartItem: cartItem) => {
                  return (
                    <li
                      className={`py-5 ${
                        cartItem === cartItems[cartItems.length - 1]
                          ? ""
                          : "border-b-[1px] border-[#e5e5e5]"
                      }`}
                      key={cartItem.productItemId}
                    >
                      <div className="w-[100px] pr-4 float-left">
                        <Image
                          src={product_2}
                          className="border boder-[#e5e5e5]"
                          alt="lastestProductImg"
                        ></Image>
                      </div>
                      <article
                        className="flex flex-col items-start w-fit
                                        text-sm"
                      >
                        <h2 className="truncate w-full text-[#363535] font-semibold">
                          {cartItem.productName}
                        </h2>
                        <span className="text-primary-color font-semibold text-[1.125rem]">{`${FormatPrice(
                          cartItem.productPrice
                        )} VNĐ`}</span>
                        <span className="text-text-light-color font-medium">
                          Qty: {cartItem.quantity}
                        </span>
                      </article>
                    </li>
                  );
                })}
            </ul>
            <table className="w-full bg-[#f5f5f5] text-sm mb-[30px]">
              <thead className="">
                <tr className="border border-[#dee2e6] text-text-color">
                  <td className="min-w-[120px] p-3 text-left font-bold">
                    Ngày đặt hàng
                  </td>
                  <td className="min-w-[120px] text-left">25/06/2023</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="w-full border border-[#dee2e6]">
                  <td className="p-3">
                    <h1 className="text-text-color font-bold">Tổng tiền :</h1>
                  </td>
                  <td className="w-fit">
                    <span className="text-primary-color font-semibold text-[18px]">{`${FormatPrice(
                      Total(cartItems) + (cartItems.length !== 0 ? 45000 : 0)
                    )} VNĐ`}</span>
                  </td>
                </tr>
                <tr className="w-full border border-[#dee2e6]">
                  <td className="p-3">
                    <h1 className="text-text-color font-bold">
                      Phương thức thanh toán :
                    </h1>
                  </td>
                  <td className="w-fit">
                    <span>COD</span>
                  </td>
                </tr>
                <tr className="w-full border border-[#dee2e6]">
                  <td className="p-3">
                    <h1 className="text-text-color font-bold">Mã đơn hàng :</h1>
                  </td>
                  <td className="w-fit">
                    <span>#011052</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <Link href={"/checkout/place-order"}>
              <button
                className="bg-primary-color w-full transition-all duration-200 hover:bg-text-color py-[18px] 
                       float-right px-[26px] font-medium text-white rounded-[5px] text-base leading-[16px]
                      "
                type="submit"
              >
                Đặt hàng
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
