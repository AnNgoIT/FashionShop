"use client";
import {
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
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
import { Total } from "@/features/cart/TotalPrice";
import { CartContext } from "@/store";
import { empty_cart } from "@/assests/images";
import { FormatPrice } from "@/features/product/FilterAmount";
import { imageLoader } from "@/features/img-loading";
import NavigateButton, { QuantityButton } from "@/components/button";
import { UserInfo, cartItem } from "@/features/types";
import usePath from "@/hooks/usePath";
import { deleteCartItem, getUserCart, updateCartItem } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/loading";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { successMessage, warningMessage } from "@/features/toasting";

export type CartProps = {
  userCart: cartItem[];
  userInfo?: UserInfo;
};

const Cart = (props: CartProps) => {
  const { userCart } = props;
  const router = useRouter();
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const { cartItems, setCartItems } = useContext(CartContext);
  const [isCartItemChecked, setCartItemChecked] = useState<cartItem[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (userCart) {
      setCartItems(userCart);
      // setCartItemChecked(cartItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleClick = (event: any) => {
    event.target.select(); // Bôi đen toàn bộ giá trị khi click vào input
  };

  const handleCartItemChecked = (cartItem: cartItem) => {
    const existingIndex = isCartItemChecked.findIndex(
      (item) => item.cartItemId === cartItem.cartItemId
    );

    if (existingIndex !== -1) {
      const updatedCartItemChecked = [...isCartItemChecked];
      updatedCartItemChecked.splice(existingIndex, 1);
      setCartItemChecked(updatedCartItemChecked);
    } else {
      setCartItemChecked([...isCartItemChecked, cartItem]);
    }
  };

  const handleCheckAllItems = () => {
    if (isCartItemChecked.length == cartItems.length) {
      setCartItemChecked([]);
    } else setCartItemChecked(cartItems);
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
          setCartItemChecked((prevItems: cartItem[]) =>
            prevItems.map((item: cartItem) =>
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
            setCartItemChecked((prevItems: cartItem[]) =>
              prevItems.map((item: cartItem) => {
                const cartItem = currCart.result.cartItems.find(
                  (item:any) => item.cartItemId == itemId
                );
                return item.cartItemId === itemId
                  ? { ...item, quantity: cartItem?.quantity! }
                  : item;
              })
            );
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
    setCartItemChecked((prevItems: cartItem[]) =>
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
      setCartItemChecked(
        isCartItemChecked.filter((item) => item.cartItemId != itemId)
      );
      router.refresh();
    }
  };
  const handleCheckout = () => {
    if (isCartItemChecked.length == 0) {
      warningMessage("Bạn chưa chọn sản phẩm nào");
    } else {
      startTransition(() => {
        router.push("/cart/checkout");
        setCartItems(isCartItemChecked);
        router.refresh();
      });
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
            loader={imageLoader}
            placeholder="blur"
            alt="Empty cart"
            className="w-full h-[18rem]"
            width={300}
            height={300}
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
                {cartItems &&
                  cartItems.map((item: cartItem) => (
                    <tr key={item.cartItemId}>
                      <td className=" max-w-[120px] p-3 border border-border-color text-[16px] leading-[30px] text-[#999] text-center">
                        <FormControlLabel
                          sx={{ marginX: "0" }}
                          label=""
                          control={
                            <Checkbox
                              checked={isCartItemChecked.some(
                                (cartItem) =>
                                  cartItem.cartItemId == item.cartItemId
                              )}
                              onChange={() => handleCartItemChecked(item)}
                            />
                          }
                        />
                      </td>
                      <td className="max-w-[120px] p-3 border border-border-color">
                        <div className="max-w-[120px] border border-border-color">
                          <Image
                            placeholder="blur"
                            blurDataURL={item.image}
                            className="w-full h-full"
                            loader={imageLoader}
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
                            onFocus={handleClick}
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
            <FormControlLabel
              sx={{ marginX: "0" }}
              label="Chọn tất cả"
              control={
                <Checkbox
                  checked={isCartItemChecked.length === cartItems.length}
                  onChange={handleCheckAllItems}
                />
              }
            />
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
                        Total(isCartItemChecked)
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
                <tr>
                  <td className="w-full p-3 border border-[#dee2e6]">
                    <article className="flex justify-between items-center">
                      <h1 className="text-text-color">Phí vận chuyển </h1>
                      <span className="text-primary-color font-semibold">{`${FormatPrice(
                        isCartItemChecked.length !== 0 ? 45000 : 0
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
                <tr>
                  <td className="w-full p-3 border border-[#dee2e6]">
                    <article className="flex justify-between items-center">
                      <h1 className="text-text-color font-bold">Thành tiền</h1>
                      <span className="text-primary-color font-bold text-[20px]">{`${FormatPrice(
                        Total(isCartItemChecked) +
                          (isCartItemChecked.length !== 0 ? 45000 : 0)
                      )} VNĐ`}</span>
                    </article>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="col-span-full mt-6">
              <NavigateButton onClick={handleCheckout}>
                Thanh toán
                <FontAwesomeIcon
                  className="text-[12px] ml-1"
                  icon={faChevronRight}
                ></FontAwesomeIcon>
              </NavigateButton>
            </div>
          </div>
        </section>
      ) : (
        userCart && userCart.length > 0 && <LoadingComponent />
      )}
    </>
  );
};

export default Cart;
