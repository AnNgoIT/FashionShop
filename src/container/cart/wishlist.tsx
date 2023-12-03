"use client";
import { useContext } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChevronLeft,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { MaxAmounts, onlyNumbers } from "@/features/product/index";
import { CartContext } from "@/store";
import { product_1 } from "@/assests/images";
import { FormatPrice } from "@/features/product/FilterAmount";
import { imageLoader } from "@/features/img-loading";
import NavigateButton, { QuantityButton } from "@/components/button";
import { cartItem } from "@/features/types";
import usePath from "@/hooks/usePath";
const WishList = () => {
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const { cartItems, setCartItems } = useContext(CartContext);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems((prevItems: any) =>
      prevItems.map((item: cartItem) =>
        item.cartItemId === itemId && MaxAmounts(newQuantity, item.amount)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems: any) =>
      prevItems.filter((item: cartItem) => item.cartItemId !== itemId)
    );
  };

  return (
    <>
      <main className="font-montserrat bg-white relative z-0">
        <section className="lg:container border-white bg-background py-16 md:py-28 px-8">
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
      <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
        <div className="col-span-full grid grid-cols-12 gap-x-7 overflow-auto">
          <table className="col-span-full">
            <thead className="text-center">
              <tr className="border border-border-color text-text-color">
                <th className=" border border-border-color min-w-[100px] p-3 text-left">
                  Sản phẩm
                </th>
                <th className=" border border-border-color min-w-[180px] p-3 text-left">
                  Tên
                </th>
                <th className=" border border-border-color min-w-[100px] p-3">
                  Giá
                </th>
                <th className=" border border-border-color min-w-[100px] p-3">
                  Số lượng
                </th>
                <th className=" border border-border-color min-w-[100px] p-3">
                  Tổng
                </th>
                <th className=" border border-border-color min-w-[100px] p-3">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cartItems.map((item: cartItem) => (
                <tr key={item.cartItemId}>
                  <td className="max-w-[120px] p-3 border border-border-color text-center">
                    <div className="max-w-[100px] border border-border-color">
                      <Image
                        loader={imageLoader}
                        placeholder="blur"
                        width={120}
                        height={0}
                        src={product_1}
                        alt="cartImg"
                      ></Image>
                    </div>
                  </td>
                  <td className=" max-w-[120px] p-3 border border-border-color text-[16px] leading-[30px] text-[#999] text-left">
                    {item.productName}
                  </td>
                  <td className="min-w-[150px] p-3 border border-border-color  text-primary-color font-bold">{`${FormatPrice(
                    item.productPrice
                  )} VNĐ`}</td>
                  <td className="min-w-[180px] p-3 border border-border-color">
                    {item.amount > 0 && (
                      <div className="w-full flex items-center justify-center">
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity - 1 < 0 ? 0 : item.quantity - 1
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                        </QuantityButton>
                        <input
                          onKeyPress={(e) => onlyNumbers(e)}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.cartItemId,
                              +e.target.value
                            )
                          }
                          className="border-y border-border-color w-10 py-1.5 text-center text-text-color outline-none
                      focus:border focus:border-primary-color"
                          value={item.quantity}
                          required
                          type="text"
                        />
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </QuantityButton>
                      </div>
                    )}
                  </td>
                  <td className="max-w-[120px] p-3 border border-border-color text-primary-color font-bold">
                    {`${item.amount > 0 ? "Available" : "Sold out"}`}
                  </td>
                  <td className="min-w-[150px] p-3 border border-border-color">
                    <button
                      title="Add To Cart"
                      className="bg-primary-color text-white py-[8px] px-[15px] disabled:opacity-25
                            disabled:hover:bg-primary-color
                            rounded-md transition-all duration-200 hover:bg-text-color mr-2"
                      disabled={item.amount <= 0}
                      onClick={() => {}}
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                    </button>
                    <button
                      title="Remove Favorite Item"
                      className="bg-primary-color text-white py-[8px] px-[15px] 
                            rounded-md transition-all duration-200 hover:bg-text-color"
                      onClick={() => handleRemoveItem(item.cartItemId)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-span-full mt-6">
          <Link href="/product">
            <NavigateButton>
              <FontAwesomeIcon
                className="text-[12px] mr-1"
                icon={faChevronLeft}
              ></FontAwesomeIcon>
              Tiếp tục mua hàng
            </NavigateButton>
          </Link>
        </div>
      </section>
    </>
  );
};

export default WishList;