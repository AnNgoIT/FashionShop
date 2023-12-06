import { empty_cart, img1 } from "@/assests/images";
import Image from "next/image";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useCallback, useContext, useEffect } from "react";
import { CartContext, UserContext } from "@/store";
import { Total } from "@/features/cart/TotalPrice";
import { onlyNumbers } from "@/features/product";
import { FormatPrice } from "@/features/product/FilterAmount";
import { cartItem } from "@/features/types";
import NavigateButton from "@/components/button";
import { imageLoader } from "@/features/img-loading";
import useLocal from "@/hooks/useLocalStorage";
import { updateCartItem, deleteCartItem, getUserCart } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import router from "next/router";
import { CartProps } from "@/container/cart/cart";
import { useRouter } from "next/navigation";
import { successMessage, warningMessage } from "@/features/toasting";

const CartDropdown = (props: CartProps) => {
  const router = useRouter();
  const { userCart, userInfo } = props;
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

  // useEffect(() => {
  //   if (userCart) {
  //     setCartItems(userCart);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleClick = (event: any) => {
    event.target.select(); // Bôi đen toàn bộ giá trị khi click vào input
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
          warningMessage("Chỉ được phép tối đa " + res.result + " sản phẩm");
          const currCart = await getUserCart(getCookie("accessToken")!);
          if (currCart.success) {
            setCartItems(currCart.result.cartItems);
          }
        } else if (res.statusCode === 401) {
          warningMessage("Vui lòng đăng nhập");
          router.push("/login");
        }
      } catch (error: any) {}
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
      successMessage("Xóa thành công");
      setCartItems(cartItems.filter((item) => item.cartItemId != itemId));
      router.refresh();
    }
  };

  return (
    <>
      {!cartItems || cartItems.length == 0 ? (
        <div className="grid place-content-center h-[17.5rem]">
          <Image
            alt="Empty cart"
            src={empty_cart}
            width={300}
            height={0}
          ></Image>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 place-content-center">
            {cartItems &&
              cartItems.map((item: cartItem, index) => {
                return (
                  <li
                    key={index}
                    className="text-text-light-color pb-[15px] mb-[15px] border-b-2 border-b-border-color text-[14px] col-span-1"
                  >
                    <div className="grid items-center gap-5 grid-flow-col">
                      <div className="border border-b-border-color h-full">
                        <Image
                          loader={imageLoader}
                          placeholder="blur"
                          blurDataURL={item.image}
                          className="h-full"
                          alt="productImage"
                          src={item.image}
                          width={200}
                          height={200}
                        ></Image>
                      </div>
                      <div className="grid">
                        <div className="transition-color flex items-center pb-1 gap-x-2">
                          <div className="text-text-light-color">
                            <span className="line-clamp-2">
                              {item.productName}
                            </span>
                          </div>
                          <button
                            title={`${"Xóa sản phẩm"}`}
                            onClick={() => handleRemoveItem(item.cartItemId)}
                          >
                            <FontAwesomeIcon
                              className={`relative top-1 hover:opacity-60 fill-text-color
                              transition-all -translate-y-4`}
                              icon={faCircleXmark}
                            />
                          </button>
                        </div>
                        <p className="font-bold mb-4">{`${FormatPrice(
                          item.productPrice
                        )} VNĐ`}</p>
                        <div className="flex items-center mb-2 text-text-light-color">
                          <label>Qty:</label>
                          <div className="inline-flex">
                            <input
                              title={`${"Thay đổi số lượng sản phẩm"}`}
                              className="border-[1px] border-border-color rounded-md py-0.5 px-3 max-w-[2.5rem]
                            outline-1 outline-primary-color mx-1 text-center"
                              onFocus={handleClick}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.cartItemId,
                                  +e.target.value
                                )
                              }
                              type="number"
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
          <div className="flex justify-between text-text-light-color text-sm">
            <span>Phí vận chuyển:</span>
            <strong className="font-black">
              {`${FormatPrice(45000)} VNĐ`}
            </strong>
          </div>
          <div className="flex justify-between text-text-light-color text-sm">
            <span>Thành tiền:</span>
            <strong className="font-black">
              {`${FormatPrice(
                Total(cartItems) + (cartItems.length !== 0 ? 45000 : 0)
              )} VNĐ`}
            </strong>
          </div>
          <div className="mt-3 flex justify-end items-center font-bold">
            <Link
              href="/cart"
              onClick={() => {
                if (!userInfo) warningMessage("Vui lòng đăng nhập");
              }}
            >
              <NavigateButton>Xem Giỏ hàng</NavigateButton>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default CartDropdown;
