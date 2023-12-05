"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { MaxAmounts, onlyNumbers } from "@/features/product/index";
import { Total } from "@/features/cart/TotalPrice";
import { CartContext } from "@/store";
import { empty_cart, product_1 } from "@/assests/images";
import { FormatPrice } from "@/features/product/FilterAmount";
import { imageLoader } from "@/features/img-loading";
import NavigateButton, { QuantityButton } from "@/components/button";
import { cartItem } from "@/features/types";
import usePath from "@/hooks/usePath";
import useLocal from "@/hooks/useLocalStorage";
import { toast } from "react-toastify";
import { deleteSuccess, maxQuanity, requireLogin } from "@/features/toasting";
import { deleteCartItem, getUserCart, updateCartItem } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/loading";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export type CartProps = {
  userCart: cartItem[];
};

const Cart = (props: CartProps) => {
  const { userCart } = props;
  const [isCartItemChecked, setCartItemChecked] = useState<number[]>([]);
  const router = useRouter();
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const { cartItems, setCartItems } = useContext(CartContext);

  let timeoutId: NodeJS.Timeout | null = null;

  const debounce = (func: Function, delay: number) => {
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleCartItemChecked = (cartItemId: number) => {
    const updatedCartItemChecked = [...isCartItemChecked];

    // Kiểm tra xem sản phẩm đã chọn có trong danh sách hay không
    const index = updatedCartItemChecked.indexOf(cartItemId);

    // Nếu sản phẩm đã được chọn thì loại bỏ khỏi danh sách, ngược lại thêm vào
    if (index === -1) {
      updatedCartItemChecked.push(cartItemId);
    } else {
      updatedCartItemChecked.splice(index, 1);
    }

    // Cập nhật state với danh sách sản phẩm đã cập nhật
    setCartItemChecked(updatedCartItemChecked);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleQuantityChangeDebounced = useCallback(
    debounce(async (itemId: number, newQuantity: number) => {
      try {
        const res = await updateCartItem(
          getCookie("accessToken")!,
          { quantity: newQuantity },
          itemId
        );
        if (res.success) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.cartItemId === itemId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
          router.refresh();
        } else if (res.statusCode === 400) {
          maxQuanity(res.result);
          router.refresh();
        } else if (res.statusCode === 401) {
          requireLogin();
          router.push("/login");
        }
      } catch (error: any) {
        console.log(error);
      }
    }, 1000),
    []
  );

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    setCartItems((prevItems: cartItem[]) =>
      prevItems.map((item: cartItem) =>
        item.cartItemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    handleQuantityChangeDebounced(itemId, newQuantity); // Gọi hàm debounce trong hàm này
  };

  const handleRemoveItem = async (itemId: number) => {
    const res = await deleteCartItem(getCookie("accessToken")!, itemId);
    if (res.success) {
      deleteSuccess();
      setCartItems(cartItems.filter((item) => item.cartItemId != itemId));
      router.refresh();
    }
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
      {userCart && userCart.length == 0 && (
        <div className="grid place-content-center h-[25rem]">
          <Image
            alt="Empty cart"
            className="w-full h-[18rem]"
            src={empty_cart}
          ></Image>
          <Link href="/product" className="flex items-center justify-center">
            <NavigateButton>Mua hàng ngay</NavigateButton>
          </Link>
        </div>
      )}
      {cartItems && cartItems.length > 0 ? (
        <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
          <div className="col-span-full grid grid-cols-12 gap-x-7 overflow-auto">
            <table className="col-span-full">
              <thead className="text-center">
                <tr className="border border-border-color text-text-color">
                  <th className=" border border-border-color min-w-[100px] p-3 text-center">
                    Chọn
                  </th>
                  <th className=" border border-border-color min-w-[100px] p-3 text-center">
                    Sản phẩm
                  </th>
                  <th className=" border border-border-color min-w-[180px] p-3 text-center">
                    Tên
                  </th>
                  <th className=" border border-border-color min-w-[180px] p-3 text-center">
                    Phân loại
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
                    <td className=" max-w-[120px] p-3 border border-border-color text-[16px] leading-[30px] text-[#999] text-center">
                      <FormControlLabel
                        sx={{ marginLeft: "0" }}
                        label=""
                        control={
                          <Checkbox
                            checked={isCartItemChecked.includes(
                              item.cartItemId
                            )}
                            onChange={() =>
                              handleCartItemChecked(item.cartItemId)
                            }
                          />
                        }
                      />
                    </td>
                    <td className="max-w-[120px] p-3 border border-border-color">
                      <div className="max-w-[120px] border border-border-color">
                        <Image
                          loader={imageLoader}
                          placeholder="blur"
                          blurDataURL={item.image}
                          width={120}
                          height={120}
                          src={item.image}
                          alt="cartImg"
                        ></Image>
                      </div>
                    </td>
                    <td className=" max-w-[120px] p-3 border border-border-color text-[16px] leading-[30px] text-[#999] text-center">
                      {item.productName}
                    </td>
                    <td className=" max-w-[120px] p-3 border border-border-color text-[16px] leading-[30px] text-[#999] text-center">
                      {item.styleValues.join(" - ")}
                    </td>
                    <td className="min-w-[150px] p-3 border border-border-color  text-primary-color font-bold">{`${FormatPrice(
                      item.productPromotionalPrice
                    )} VNĐ`}</td>
                    <td className=" min-w-[180px] p-3 border border-border-color">
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
                          type="number"
                          onKeyDown={(e) => onlyNumbers(e)}
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
                    </td>
                    <td className="min-w-[150px] p-3 border border-border-color text-primary-color font-bold">{`${FormatPrice(
                      item.productPromotionalPrice * item.quantity
                    )} VNĐ`}</td>
                    <td className="max-w-[120px] p-3 border border-border-color">
                      <button
                        title="Remove Cart Item"
                        className="bg-primary-color text-white py-[8px] px-[15px] rounded-md transition-all duration-200 hover:bg-text-color"
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
          <div className="col-span-full grid grid-cols-12 place-items-center pt-[30px]">
            <table className="col-span-full min-w-[400px]">
              <thead className="text-center">
                <tr className="border border-border-color text-text-color">
                  <th className=" border border-border-color min-w-[100px] p-3 text-center">
                    Tổng tiền
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td className="w-full p-3 border border-[#dee2e6]">
                    <article className="flex justify-between items-center">
                      <h1 className="text-text-color">Tổng tiền giỏ hàng </h1>
                      <span className="text-primary-color font-semibold">{`${FormatPrice(
                        Total(cartItems)
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
                <tr>
                  <td className="w-full p-3 border border-[#dee2e6]">
                    <article className="flex justify-between items-center">
                      <h1 className="text-text-color">Phí vận chuyển </h1>
                      <span className="text-primary-color font-semibold">{`${FormatPrice(
                        cartItems.length !== 0 ? 45000 : 0
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
                <tr>
                  <td className="w-full p-3 border border-[#dee2e6]">
                    <article className="flex justify-between items-center">
                      <h1 className="text-text-color font-bold">Thành tiền</h1>
                      <span className="text-primary-color font-bold text-[20px]">{`${FormatPrice(
                        Total(cartItems) + (cartItems.length !== 0 ? 45000 : 0)
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="col-span-full mt-6">
              <Link href="/cart/checkout">
                <NavigateButton>
                  Thanh toán
                  <FontAwesomeIcon
                    className="text-[12px] ml-1"
                    icon={faChevronRight}
                  ></FontAwesomeIcon>
                </NavigateButton>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        userCart.length > 0 && <LoadingComponent />
      )}
    </>
  );
};

export default Cart;
