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
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import { warningMessage } from "@/features/toasting";
import { useRouter } from "next/navigation";

const OrderHistory = ({ orders }: { orders: orderItem[] }) => {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<productItemInOrder[] | null>(
    null
  );

  const [orderList, setOrderList] = useState<orderItem[]>(orders);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (orders) {
      setOrderList(orders);
    }
  }, [orders]);

  const handleOpenDetail = async (item: orderItem) => {
    const res = await getUserOrder(item.orderId, getCookie("accessToken")!);
    if (res.success) {
      setOrderDetail(res.result.orderItems);
    } else if (res.statusCode == 401) {
      warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
      router.refresh();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOrderDetail(null);
    setOpen(false);
  };

  const handleFeedBackOrder = (id: number) => {};
  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
bg-white p-5 max-lg:px-10 rounded-sm mb-8 gap-y-1`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center pb-4 border-b-[0] lg:border-b border-border-color">
        Lịch sử đơn mua
      </h2>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="relative" sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-left pb-4">
            Chi tiết đơn mua
          </h2>
          <ul className="min-h-[21rem]">
            {orderDetail &&
              orderDetail.length > 0 &&
              orderDetail.map((productItem) => {
                return (
                  <li className="w-full" key={productItem.orderItemId}>
                    <div className="flex justify-between p-2">
                      <div className="flex gap-x-2">
                        <Image
                          className="outline outline-1 outline-border-color w-[6rem] h-[7rem]"
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
          <div className="absolute px-2 py-4 border-t border-text-color w-[90%]">
            <div className="flex justify-between text-text-light-color text-base p-2">
              <span> Phí vận chuyển: </span>
              <strong className="font-black">{FormatPrice(45000)} VNĐ</strong>
            </div>
            <div className="flex justify-between text-text-light-color text-base p-2">
              <span> Tổng đơn hàng: </span>
              <strong className="font-black">
                {orderDetail && FormatPrice(Total(orderDetail))}
                VNĐ
              </strong>
            </div>
            <div className="flex justify-between text-secondary-color text-xl font-bold p-2">
              <span> Thành tiền: </span>
              <strong className="font-black">
                {orderDetail && FormatPrice(Total(orderDetail) + 45000)}
                VNĐ
              </strong>
            </div>
          </div>
        </Box>
      </Modal>
      {orderList &&
      orderList.filter(
        (order) => order.status == "DELIVERED" || order.status == "CANCELLED"
      ).length > 0 ? (
        <ul className="col-span-full h-[16rem] overflow-auto px-2">
          {orderList
            .filter(
              (order) =>
                order.status == "DELIVERED" || order.status == "CANCELLED"
            )
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
                    className={`col-span-4 md:col-span-2 text-center ${
                      item.status == "CANCELLED" ? "bg-red-500" : "bg-green-500"
                    }  grid place-content-center text-white rounded-lg`}
                  >
                    {item.status == "CANCELLED"
                      ? "Đơn hàng bị hủy"
                      : "Giao hàng thành công"}
                  </div>
                  <div className="flex items-center gap-x-4 col-span-full md:col-span-4 md:col-start-9">
                    <Button
                      onClick={() => handleOpenDetail(item)}
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
                      onClick={() => handleFeedBackOrder(item.orderId)}
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
        <div className="col-span-full min-h-[14rem] grid place-content-center">
          <Image
            className="w-full h-full"
            width={200}
            height={200}
            alt="emptyOrder"
            src={empty_order}
          ></Image>
          <span className="text-center mr-4 pt-2">Lịch sử trống</span>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
