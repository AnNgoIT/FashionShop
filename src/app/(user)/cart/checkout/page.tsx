"use client";
import { product_2 } from "@/assests/images";
import { Total } from "@/features/cart/TotalPrice";
import { FormatPrice } from "@/features/product/FilterAmount";
import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/image";
import { CartContext } from "@/store/globalState";
import BillForm from "@/container/order/bill-form";

export type OrderItem = {
  id: number;
  name?: string;
  price: number;
  quantity: number;
};

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);

  return (
    <section className="container grid grid-cols-12 py-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12 gap-x-7">
        <div className={`col-span-full md:col-span-5 md:col-start-2`}>
          {true ? (
            <>
              <h1 className="text-xl font-semibold text-text-color mb-8 max-md:text-center">
                BILLING DETAILS
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
          <h1 className="text-xl font-semibold text-text-color mb-3 max-md:text-center">
            YOUR ORDER
          </h1>
          <ul className="flex flex-col mb-[40px]">
            {cartItems &&
              cartItems.map((cartItem: OrderItem) => {
                return (
                  <li
                    className={`py-5 ${
                      cartItem === cartItems[cartItems.length - 1]
                        ? ""
                        : "border-b-[1px] border-[#e5e5e5]"
                    }`}
                    key={cartItem.id}
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
                        {cartItem.name}
                      </h2>
                      <span className="text-primary-color font-semibold text-[1.125rem]">{`${FormatPrice(
                        cartItem.price
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
                  Order Places:
                </td>
                <td className="min-w-[120px] p-3 text-left">25/06/2023</td>
              </tr>
            </thead>
            <tbody className="">
              <tr className="w-full border border-[#dee2e6]">
                <td className="p-3">
                  <h1 className="text-text-color font-bold">Total :</h1>
                </td>
                <td className="w-fit">
                  <span className="text-primary-color font-semibold text-[18px]">{`${FormatPrice(
                    Total(cartItems) + (cartItems.length !== 0 ? 45000 : 0)
                  )} VNĐ`}</span>
                </td>
              </tr>
              <tr className="w-full border border-[#dee2e6]">
                <td className="p-3">
                  <h1 className="text-text-color font-bold">Payment :</h1>
                </td>
                <td className="w-fit">
                  <span>COD</span>
                </td>
              </tr>
              <tr className="w-full border border-[#dee2e6]">
                <td className="p-3">
                  <h1 className="text-text-color font-bold">Order No. :</h1>
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
              Place Order
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
