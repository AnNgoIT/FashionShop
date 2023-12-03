import { empty_notify, img1 } from "@/assests/images";
import Image from "next/image";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "@/store";
import { Total } from "@/features/cart/TotalPrice";
import { MaxAmounts, onlyNumbers } from "@/features/product";
import { FormatPrice } from "@/features/product/FilterAmount";
import { cartItem } from "@/features/types";
import NavigateButton from "@/components/button";

const NotifyDropdown = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems((prevItems: cartItem[]) =>
      prevItems.map((item: cartItem) =>
        item.cartItemId === itemId && MaxAmounts(newQuantity, item.amount)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems: cartItem[]) =>
      prevItems.filter((item: cartItem) => item.cartItemId !== itemId)
    );
  };

  return (
    <>
      {!cartItems || cartItems.length == 0 ? (
        <div className="grid place-content-center h-[17.5rem]">
          <Image
            alt="Empty Notifications"
            src={empty_notify}
            width={300}
            height={0}
          ></Image>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 place-content-center">
            {cartItems.map((item: cartItem) => {
              return (
                <li
                  key={item.cartItemId}
                  className="text-text-light-color pb-[15px] mb-[15px] border-b-2 border-b-border-color text-[14px] col-span-1"
                >
                  <div className="grid items-center gap-5 grid-flow-col">
                    <Link
                      href={`/product/${item.cartItemId}`}
                      className="border-b-2 border-b-border-color"
                    >
                      <Image
                        className="h-auto"
                        alt="productImage"
                        src={img1}
                      ></Image>
                    </Link>
                    <div className="grid">
                      <span className="transition-color flex justify-center pb-1 gap-x-2">
                        <Link
                          className="hover:text-primary-color text-text-light-color transition-colors"
                          href={`/product/detail/${item.cartItemId}`}
                        >
                          {item.productName}
                        </Link>
                        <FontAwesomeIcon
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="relative top-1 hover:opacity-60 fill-text-color transition-all"
                          icon={faCircleXmark}
                        />
                      </span>
                      <p className="font-bold mb-4">{`${FormatPrice(
                        item.productPrice
                      )} VNĐ`}</p>
                      <div className="flex items-center mb-2 text-text-light-color">
                        <label>Qty:</label>
                        <div className="inline-flex">
                          <input
                            className="border-[1px] border-border-color rounded-md py-0.5 px-3 max-w-[2.5rem]
                            outline-1 outline-primary-color mx-1 text-center"
                            onKeyDown={(e) => onlyNumbers(e)}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.cartItemId,
                                +e.target.value
                              )
                            }
                            type="text"
                            value={item.quantity}
                            required
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default NotifyDropdown;
