"use client";
// import usePath from "@/hooks/usePath";
import { useContext } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cartItem } from "@/store/globalState";
import {
  faCartShopping,
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { MaxAmounts, onlyNumbers } from "@/features/product/index";
import { Total } from "@/features/cart/TotalPrice";
import { CartContext } from "@/store/globalState";
import { product_1 } from "@/assests/images";
import { FormatPrice } from "@/features/product/FilterAmount";
import { imageLoader } from "@/features/img-loading";
import NavigateButton, { QuantityButton } from "@/components/button";
import { Button } from "@mui/material";
const Cart = () => {
  //   const thisPaths = usePath();
  const { cartItems, setCartItems } = useContext(CartContext);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems((prevItems: any) =>
      prevItems.map((item: cartItem) =>
        item.id === itemId && MaxAmounts(newQuantity, item.maxQuantity)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems: any) =>
      prevItems.filter((item: cartItem) => item.id !== itemId)
    );
  };

  return (
    <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12 gap-x-7 overflow-auto">
        <table className="col-span-full">
          <thead className="text-center">
            <tr className="border border-border-color text-text-color">
              <th className=" border border-border-color min-w-[100px] p-3 text-left">
                Product
              </th>
              <th className=" border border-border-color min-w-[180px] p-3 text-left">
                Product Name
              </th>
              <th className=" border border-border-color min-w-[100px] p-3">
                Price
              </th>
              <th className=" border border-border-color min-w-[100px] p-3">
                Quantity
              </th>
              <th className=" border border-border-color min-w-[100px] p-3">
                Status
              </th>
              <th className=" border border-border-color min-w-[100px] p-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {cartItems.map((item: cartItem) => (
              <tr key={item.id}>
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
                  {item.name}
                </td>
                <td className="min-w-[150px] p-3 border border-border-color  text-primary-color font-bold">{`${FormatPrice(
                  item.price
                )} VNĐ`}</td>
                <td className="min-w-[180px] p-3 border border-border-color">
                  {item.maxQuantity > 0 && (
                    <div className="w-full flex items-center justify-center">
                      <QuantityButton
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity - 1 < 0 ? 0 : item.quantity - 1
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                      </QuantityButton>
                      <input
                        onKeyPress={(e) => onlyNumbers(e)}
                        onChange={(e) =>
                          handleQuantityChange(item.id, +e.target.value)
                        }
                        className="border-y border-border-color w-10 py-1.5 text-center text-text-color outline-none
                      focus:border focus:border-primary-color"
                        value={item.quantity}
                        required
                        type="text"
                      />
                      <QuantityButton
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                      </QuantityButton>
                    </div>
                  )}
                </td>
                <td className="max-w-[120px] p-3 border border-border-color text-primary-color font-bold">
                  {`${item.maxQuantity > 0 ? "Available" : "Sold out"}`}
                </td>
                <td className="min-w-[150px] p-3 border border-border-color">
                  <button
                    title="Add To Cart"
                    className="bg-primary-color text-white py-[8px] px-[15px] disabled:opacity-25
                            disabled:hover:bg-primary-color
                            rounded-md transition-all duration-200 hover:bg-text-color mr-2"
                    disabled={item.maxQuantity <= 0}
                    onClick={() => {}}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </button>
                  <button
                    title="Remove Cart Item"
                    className="bg-primary-color text-white py-[8px] px-[15px] 
                            rounded-md transition-all duration-200 hover:bg-text-color"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-span-full">
        <Link href="/product">
          <NavigateButton>
            <FontAwesomeIcon
              className="text-[12px] mr-1"
              icon={faChevronLeft}
            ></FontAwesomeIcon>
            Continue Shopping
          </NavigateButton>
        </Link>
      </div>
    </section>
  );
};

export default Cart;
