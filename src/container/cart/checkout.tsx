"use client";
import { Total } from "@/features/cart/TotalPrice";
import { FormatPrice } from "@/features/product/FilterAmount";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CartContext } from "@/store";
import usePath from "@/hooks/usePath";
import { UserInfo, cartItem } from "@/features/types";
import { imageLoader } from "@/features/img-loading";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OrderInfo from "@/container/order/info";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import { makeAnOrder } from "@/hooks/useAuth";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { warningMessage } from "@/features/toasting";
import { getAuthenticated } from "@/hooks/useData";

type CheckOutProps = {
  userInfo?: UserInfo;
};

type OrderInfo = {
  cartItemIds: number[];
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: string;
};

const Checkout = (props: CheckOutProps) => {
  const router = useRouter();
  const { userInfo } = props;
  const { cartItems } = useContext(CartContext);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    cartItemIds: cartItems?.map((cart) => cart.cartItemId) || [],
    fullName: userInfo?.fullname || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address?.split(",")[0] || "",
    paymentMethod: "COD",
  });

  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];

  const handleAddress = (value: string) => {
    setOrderInfo({
      ...orderInfo,
      address: value,
    });
  };

  if (cartItems.length == 0) {
    redirect("/cart");
  }

  const handleSubmitOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newOrder: OrderInfo = orderInfo;
    if (newOrder.address.length == 0) {
      warningMessage("Vui lòng chọn địa chỉ nhận hàng");
    } else if (!newOrder.phone) {
      warningMessage("Vui lòng cung cấp số điện thoại");
      router.push("/profile");
    } else {
      const id = toast.loading("Vui lòng chờ...");
      const res = await makeAnOrder(getCookie("accessToken")!, newOrder);
      if (res.success) {
        if (newOrder.paymentMethod == "COD") {
          toast.update(id, {
            render: `Bạn đã đặt hàng thành công`,
            type: "success",
            autoClose: 1500,
            isLoading: false,
          });
          router.push("/profile/order-tracking");
          router.refresh();
        } else if (newOrder.paymentMethod == "E_WALLET") {
          const vnPayPayment = await getAuthenticated(
            `/api/v1/users/customers/orders/${res.result.content.orderId}/checkout-eWallet`,
            getCookie("accessToken")!
          );
          if (vnPayPayment.success) {
            toast.dismiss();
            setCookie("isPayment", true);
            window.location.href = vnPayPayment.result;
            router.refresh();
          } else if (vnPayPayment.statusCode == 401) {
            warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
            router.refresh();
          } else if (vnPayPayment.status == 500) {
            toast.update(id, {
              render: `Lỗi hệ thống`,
              type: "error",
              autoClose: 1500,
              isLoading: false,
            });
            router.refresh();
          } else {
            toast.update(id, {
              render: `Dữ liệu truyền chưa chính xác`,
              type: "error",
              autoClose: 1500,
              isLoading: false,
            });
          }
        }
      } else if (res.status == 500) {
        toast.update(id, {
          render: `Lỗi hệ thống`,
          type: "error",
          autoClose: 1500,
          isLoading: false,
        });
      } else if (res.statusCode == 401) {
        warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
        router.refresh();
      } else {
        toast.update(id, {
          render: `Dữ liệu truyền chưa chính xác`,
          type: "error",
          autoClose: 1500,
          isLoading: false,
        });
      }
    }
  };

  return (
    <>
      <main className="font-montserrat bg-white lg:mt-[16px] relative z-0">
        <section className="lg:container border-white bg-background px-8 py-4 rounded-md max-md:rounded-none">
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
      <section className="container grid grid-cols-12 max-md:px-4 py-4 mt-2">
        <div className="col-span-full grid grid-cols-12 gap-7">
          <div
            className={`col-span-full outline outline-2 outline-border-color`}
          >
            <h1
              className="text-xl font-semibold text-secondary-color max-md:text-center flex 
            items-center max-md:justify-center border-b p-3 border-border-color"
            >
              <LocationOnIcon
                sx={{ color: "#f22a59", marginRight: "0.25rem" }}
              />
              Địa chỉ nhận hàng
            </h1>
            <OrderInfo
              info={userInfo}
              handleOrderInfo={handleAddress}
            ></OrderInfo>
          </div>
          <div
            className={`col-span-full outline outline-2 outline-border-color`}
          >
            <h1
              className="text-xl font-semibold text-secondary-color max-md:text-center flex 
            items-center max-md:justify-center border-b p-3 border-border-color"
            >
              <LocalMallIcon
                sx={{ color: "#f22a59", marginRight: "0.25rem" }}
              />
              Đơn hàng
            </h1>
            <ul className="flex flex-col">
              {cartItems &&
                cartItems.map((cartItem: cartItem) => {
                  return (
                    <li
                      className={`p-4 ${
                        cartItem === cartItems[cartItems.length - 1]
                          ? ""
                          : "border-b border-[#e5e5e5]"
                      }`}
                      key={cartItem.productItemId}
                    >
                      <div className="pr-4 float-left">
                        <Image
                          loader={imageLoader}
                          blurDataURL={cartItem.image}
                          placeholder="blur"
                          src={cartItem.image}
                          width={120}
                          height={120}
                          className="border boder-[#e5e5e5]"
                          alt="lastestProductImg"
                        ></Image>
                      </div>
                      <div className="flex flex-col items-start w-fit text-sm py-2">
                        <h2 className=" text-text-color font-bold text-lg text-ellipsis line-clamp-2">
                          {cartItem.productName}
                        </h2>
                        <span className="text-text-light-color font-medium">{`Giá: ${FormatPrice(
                          cartItem.productPrice
                        )} VNĐ`}</span>
                        <span className="text-text-light-color font-medium">
                          Số lượng: {cartItem.quantity} sản phẩm
                        </span>
                        <span className="text-text-light-color font-medium">
                          Phân loại: {cartItem.styleValues.join(", ")}
                        </span>
                        <span className="text-secondary-color font-semibold text-[1.125rem] py-2">
                          Thành tiền:{" "}
                          {`${FormatPrice(
                            cartItem.quantity * cartItem.productPrice
                          )} VNĐ`}
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div
            className={`col-span-full grid grid-cols-12 outline outline-2 outline-border-color`}
          >
            <h1 className="col-span-full text-xl font-semibold text-secondary-color max-md:text-center flex items-center max-md:justify-center border-b p-3 border-border-color">
              <LocationOnIcon
                sx={{ color: "#f22a59", marginRight: "0.25rem" }}
              />
              Phương thức thanh toán
            </h1>
            <div className="col-span-full md:col-span-6 p-4 max-md:flex max-md:items-center max-md:justify-center">
              {["Ví VNPay", "Thanh toán khi nhận"].map((item, index) => {
                return (
                  <Button
                    onClick={() =>
                      setOrderInfo({
                        ...orderInfo,
                        paymentMethod:
                          item == "Thanh toán khi nhận" ? "COD" : "E_WALLET",
                      })
                    }
                    sx={{
                      color: "#f22a59",
                      borderColor: "#f22a59",
                      margin: "0 0.5rem",
                      "&:hover": {
                        opacity: "0.6",
                        background: "transparent",
                        borderColor: "#f22a59",
                      },
                    }}
                    className="truncate"
                    key={item}
                    variant="outlined"
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
            <div className="col-span-full md:col-span-6 p-4">
              <table className=" bg-[#f5f5f5] text-sm mb-4 w-full">
                <tbody className="">
                  <tr className="w-full border border-[#dee2e6]">
                    <td className="p-3">
                      <h1 className="text-text-color font-bold">
                        Tổng tiền hàng :
                      </h1>
                    </td>
                    <td className="w-fit">
                      <span className="text-text-color font-bold">{`${FormatPrice(
                        Total(cartItems)
                      )} VNĐ`}</span>
                    </td>
                  </tr>
                  <tr className="w-full border border-[#dee2e6]">
                    <td className="p-3">
                      <h1 className="text-text-color font-bold">
                        Phí vận chuyển :
                      </h1>
                    </td>
                    <td className="w-fit">
                      <span>{`${FormatPrice(45000)} VNĐ`}</span>
                    </td>
                  </tr>
                  <tr className="w-full border border-[#dee2e6]">
                    <td className="p-3">
                      <h1 className="text-text-color font-bold">
                        Phương thức thanh toán :
                      </h1>
                    </td>
                    <td className="w-[12rem]">
                      <span>
                        {orderInfo.paymentMethod == "COD"
                          ? "Thanh toán khi nhận"
                          : "Ví VNPay"}
                      </span>
                    </td>
                  </tr>
                  <tr className="w-full border border-[#dee2e6]">
                    <td className="p-3">
                      <h1 className="text-text-color font-bold">
                        Tổng thanh toán:
                      </h1>
                    </td>
                    <td className="w-fit">
                      <span className="text-secondary-color font-semibold text-lg">{`${FormatPrice(
                        Total(cartItems) + 45000
                      )} VNĐ `}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={handleSubmitOrder}
                className="bg-secondary-color  transition-all duration-200 hover:opacity-60 py-[1.125rem]
                float-right px-6 font-medium text-white rounded-md text-base"
              >
                {orderInfo.paymentMethod == "E_WALLET"
                  ? "Thanh toán"
                  : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
