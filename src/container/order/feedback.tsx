"use client";
import Image from "next/image";
import { empty_order } from "@/assests/images";
import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { imageLoader, modalOrderDetailStyle } from "@/features/img-loading";
import { FormatPrice } from "@/features/product/FilterAmount";
import { Total } from "@/features/cart/TotalPrice";
import { orderItem, productItemInOrder } from "@/features/types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { getUserOrder } from "@/hooks/useAuth";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { getCookie, getCookies, hasCookie } from "cookies-next";
import dayjs from "dayjs";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { postAuthenticatedData } from "@/hooks/useData";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import TextField from "@mui/material/TextField";
import ProductDetail from "../product/detail";

type Feedback = {
  orderItemId: number;
  content: string;
  star: number | null;
};
type HoverFeedback = {
  orderItemId: number;
  star: number;
};
const labels: { [index: string]: string } = {
  1: "Tệ",
  2: "Không hài lòng",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Tuyệt vời",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const OrderFeedback = ({ orders }: { orders: orderItem[] }) => {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<{
    order: orderItem;
    orderItems: productItemInOrder[];
  } | null>(null);
  const [orderList, setOrderList] = useState<orderItem[]>(orders);
  const [open, setOpen] = useState<boolean>(false);
  const [openFeedBackModal, setOpenFeedBackModal] = useState<boolean>(false);
  const [hover, setHover] = useState<HoverFeedback[]>([]);
  const [feedBack, setFeedBack] = useState<Feedback[]>([]);
  useEffect(() => {
    if (orders) {
      setOrderList(orders);
    }
  }, [orders]);

  const handleOpenDetail = async (item: orderItem) => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return undefined;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

    const res = await getUserOrder(item.orderId, getCookie("accessToken")!);
    if (res.success) {
      setOrderDetail(res.result);
      return res.result.orderItems;
    } else if (res.statusCode == 401) {
      warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
      router.refresh();
    }
  };

  const handleClose = () => {
    setOrderDetail(null);
    setOpen(false);
  };

  const handleOpen = async (item: orderItem) => {
    setOpen(true);
    const result = await handleOpenDetail(item);
    if (!result) {
      handleClose();
    }
  };
  const handleCloseFeedBack = () => {
    setOrderDetail(null);
    setOpenFeedBackModal(false);
    setFeedBack([]);
  };

  const handleSubmitFeedBack = async () => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      handleCloseFeedBack();
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      handleCloseFeedBack();
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

    const orderItems = orderDetail?.orderItems;

    if (orderItems) {
      for (const item of orderItems) {
        if (
          feedBack.find((feedBack) => feedBack.orderItemId === item.orderItemId)
            ?.star === 0
        ) {
          warningMessage(`Vui lòng chọn số sao đánh giá cho sản phẩm`);
          break;
        } else if (
          feedBack.find((feedBack) => feedBack.orderItemId === item.orderItemId)
            ?.content === ""
        ) {
          warningMessage(`Vui lòng nhập nội dung đánh giá cho sản phẩm`);
          break;
        }

        const res = await postAuthenticatedData(
          `/api/v1/users/customers/ratings/${item.orderItemId}`,
          feedBack.find(
            (feedBackItem) => feedBackItem.orderItemId === item.orderItemId
          ),
          getCookie("accessToken")!
        );

        handleCloseFeedBack();
        setFeedBack([]);

        if (res.success) {
          successMessage("Đánh giá thành công");
          router.refresh();
        } else if (res.status === 400 || res.statusCode === 500) {
          warningMessage(`Sản phẩm ${item.productName} đã được đánh giá`);
          break;
        }
      }
    }
  };
  const handleFeedBackOrder = async (item: orderItem) => {
    setOpenFeedBackModal(true);
    const result = await handleOpenDetail(item);
    const feedBackList =
      result &&
      result.map((item: any) => ({
        orderItemId: item.orderItemId,
        star: 5,
        content: "",
      }));
    if (!result) {
      handleCloseFeedBack();
    }
    setFeedBack(feedBackList);
    setHover(feedBackList);
  };
  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
bg-white ssm:p-1 md:p-5 max-lg:px-10 rounded-sm mb-8 gap-y-1 h-fit`}
    >
      <h2
        className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center max-md:p-4 pb-4 
      border-b-[0] lg:border-b border-border-color h-fit"
      >
        Đánh giá đơn mua
      </h2>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="order-feedback-title"
        aria-describedby="order-feedback-description"
      >
        <Box className="" sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center p-2">
            Chi tiết đơn mua
          </h2>
          {orderDetail && orderDetail.orderItems.length > 0 ? (
            <>
              <ul className="min-h-[21rem]">
                {orderDetail.orderItems.map((productItem) => {
                  return (
                    <li className="w-full" key={productItem.orderItemId}>
                      <div className="flex justify-between py-2">
                        <div className="flex gap-x-2">
                          <Image
                            className="outline outline-2 outline-secondary-color w-[6rem] h-[7rem] p-1"
                            src={productItem.image}
                            blurDataURL={productItem.image}
                            loader={imageLoader}
                            placeholder="blur"
                            width={100}
                            height={100}
                            alt={"orderItemImg"}
                          ></Image>
                          <h1 className="text-sm text-secondary-color font-bold">
                            {productItem.productName}
                          </h1>
                        </div>
                        <span className="text-text-light-color text-md">{`x${productItem.quantity}`}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="py-4 border-t border-text-light-color">
                <div className="flex justify-between text-text-light-color text-base p-1">
                  <span> Tổng đơn hàng: </span>
                  <strong className="font-black">
                    {orderDetail && FormatPrice(Total(orderDetail.orderItems))}{" "}
                    VNĐ
                  </strong>
                </div>
                <div className="flex justify-between text-text-light-color text-base p-1">
                  <span> Phí vận chuyển: </span>
                  <strong className="font-black">
                    {orderDetail &&
                      FormatPrice(orderDetail.order.shippingCost || 0)}{" "}
                    VNĐ
                  </strong>
                </div>
                <div className="flex justify-between text-text-light-color text-base p-1">
                  <span> Phương thức thanh toán: </span>
                  <strong className="font-black">
                    {orderDetail?.order.paymentMethod == "COD"
                      ? "Thanh toán khi nhận"
                      : "Ví điện tử VNPay"}
                  </strong>
                </div>
                <div className="flex justify-between text-secondary-color text-xl font-bold p-1">
                  <span> Thành tiền: </span>
                  <strong className="font-black">
                    {orderDetail &&
                      FormatPrice(
                        Total(orderDetail.orderItems) +
                          orderDetail.order.shippingCost || 0
                      )}{" "}
                    VNĐ
                  </strong>
                </div>
              </div>{" "}
            </>
          ) : (
            <div className="flex justify-center items-center p-4 h-[29.3rem]">
              <CircularProgress />
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={openFeedBackModal}
        onClose={handleCloseFeedBack}
        aria-labelledby="order-info-title"
        aria-describedby="order-info-description"
      >
        <Box sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-secondary-color uppercase font-semibold text-center pb-4">
            Đánh giá đơn hàng
          </h2>
          {orderDetail && orderDetail.orderItems.length > 0 ? (
            <>
              <ul className="min-h-[21rem]">
                {orderDetail.orderItems.map((productItem) => {
                  return (
                    <li className="w-full" key={productItem.orderItemId}>
                      <div className="flex justify-between py-2">
                        <div className="flex gap-x-2">
                          <Image
                            className="outline outline-2 outline-secondary-color w-[6rem] h-[7rem] p-1"
                            src={productItem.image}
                            blurDataURL={productItem.image}
                            loader={imageLoader}
                            placeholder="blur"
                            width={100}
                            height={100}
                            alt={"orderItemImg"}
                          ></Image>
                          <h1 className="text-sm text-secondary-color font-bold">
                            {productItem.productName}
                          </h1>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="w-full flex gap-x-2 py-2 text-sm items-center">
                          <span className="">Chất lượng đơn hàng</span>
                          <Rating
                            name="star"
                            value={
                              feedBack.find(
                                (feedBack) =>
                                  feedBack.orderItemId ==
                                  productItem.orderItemId
                              )?.star || 5
                            }
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                              setFeedBack((feedBacks: Feedback[]) =>
                                feedBacks.map((item: Feedback) =>
                                  item.orderItemId === productItem.orderItemId
                                    ? { ...item, star: newValue }
                                    : item
                                )
                              );
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover((hover: HoverFeedback[]) =>
                                hover.map((item: HoverFeedback) =>
                                  item.orderItemId === productItem.orderItemId
                                    ? { ...item, star: newHover }
                                    : item
                                )
                              );
                            }}
                            emptyIcon={
                              <StarIcon
                                fontSize="medium"
                                sx={{ opacity: "0.55" }}
                              />
                            }
                          />
                          {feedBack.find(
                            (feedBack) =>
                              feedBack.orderItemId == productItem.orderItemId
                          )?.star !== null && (
                            <Box sx={{ ml: 2 }}>
                              {
                                labels[
                                  hover.length > 0 &&
                                  hover.find(
                                    (hover) =>
                                      hover.orderItemId ==
                                      productItem.orderItemId
                                  )?.star !== -1
                                    ? hover.find(
                                        (hover) =>
                                          hover.orderItemId ==
                                          productItem.orderItemId
                                      )?.star!
                                    : feedBack.find(
                                        (feedBack) =>
                                          feedBack.orderItemId ==
                                          productItem.orderItemId
                                      )?.star!
                                ]
                              }
                            </Box>
                          )}
                        </div>
                        <div className="w-full flex gap-x-2 py-2 text-lg items-center">
                          <TextField
                            type="text"
                            required
                            name="content"
                            value={
                              feedBack.find(
                                (feedBack) =>
                                  feedBack.orderItemId ==
                                  productItem.orderItemId
                              )?.content
                            }
                            onChange={(e) =>
                              setFeedBack((feedBacks: Feedback[]) =>
                                feedBacks.map((item: Feedback) =>
                                  item.orderItemId === productItem.orderItemId
                                    ? { ...item, content: e.target.value }
                                    : item
                                )
                              )
                            }
                            sx={{
                              background: "white",
                              borderRadius: "0.25rem",
                            }}
                            inputProps={{
                              maxLength: 200,
                            }}
                            className="w-full"
                            id="filled-multiline-flexible"
                            placeholder="Nhập nội dung..."
                            multiline
                            rows={3}
                            variant="filled"
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* <div className="py-4 border-t border-text-light-color">
                <div className="flex justify-between text-text-light-color text-base p-1">
                  <span> Tổng đơn hàng: </span>
                  <strong className="font-black">
                    {orderDetail && FormatPrice(Total(orderDetail.orderItems))}
                    VNĐ
                  </strong>
                </div>
                <div className="flex justify-between text-text-light-color text-base p-1">
                  <span> Phương thức thanh toán: </span>
                  <strong className="font-black">
                    {orderDetail?.order.paymentMethod == "COD"
                      ? "Thanh toán khi nhận"
                      : "Ví điện tử VNPay"}
                  </strong>
                </div>
                <div className="flex justify-between text-secondary-color text-xl font-bold p-1">
                  <span> Thành tiền: </span>
                  <strong className="font-black">
                    {orderDetail && FormatPrice(Total(orderDetail.orderItems))}
                    VNĐ
                  </strong>
                </div>
              </div>{" "} */}
              <div className="w-full pt-4 flex justify-end gap-x-4">
                <button
                  onClick={() => handleCloseFeedBack()}
                  className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleSubmitFeedBack()}
                  className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md"
                >
                  Gửi
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center p-4 h-[29.3rem]">
              <CircularProgress />
            </div>
          )}
        </Box>
      </Modal>
      {orderList &&
      orderList.filter((order) => order.status == "DELIVERED").length > 0 ? (
        <ul className="col-span-full h-[20rem] overflow-auto px-2">
          {orderList
            .filter((order) => order.status == "DELIVERED")
            .sort((a, b) => b.orderId - a.orderId)
            .map((item: orderItem) => {
              return (
                <li
                  key={`order-${item.orderId}`}
                  className="grid grid-cols-12 py-3 border-b border-text-light-color gap-y-2"
                >
                  <div className="col-span-8 md:col-span-5">
                    <h1 className="text-lg text-secondary-color">
                      ID Đơn mua: {item.orderId}
                    </h1>
                    <h2>
                      Ngày đặt hàng:
                      {` ${dayjs(new Date(item.createdAt!)).format(
                        "DD/MM/YYYY"
                      )}`}
                    </h2>
                  </div>
                  <div
                    className={`col-span-4 md:col-span-2 text-center bg-green-500 grid place-content-center text-white rounded-lg`}
                  >
                    Giao hàng thành công
                  </div>
                  <div className="flex items-center gap-x-4 col-span-full md:col-span-4 md:col-start-9">
                    <Button
                      onClick={() => handleOpen(item)}
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "1rem",
                        "&:hover": {
                          background: "#639df1",
                          color: "white",
                        },
                      }}
                    >
                      <InfoIcon />
                      <span className="text-lg pl-1">Chi tiết</span>
                    </Button>
                    <Button
                      onClick={() => handleFeedBackOrder(item)}
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "1rem",
                        "&:hover": {
                          background: "#f22a59",
                          color: "white",
                        },
                        color: "#f22a59",
                      }}
                    >
                      <FeedbackIcon />
                      <span className="text-lg pl-1">Đánh giá</span>
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="col-span-full min-h-[20rem] grid place-content-center">
          <Image
            className="w-full h-full"
            width={200}
            height={200}
            alt="emptyOrder"
            src={empty_order}
          ></Image>
          <span className="text-center mr-4 pt-2">Không có đơn hàng nào</span>
        </div>
      )}
    </div>
  );
};

export default OrderFeedback;
