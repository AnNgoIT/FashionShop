"use client";
import Image from "next/image";
import { empty_order, product_1 } from "@/assests/images";
import React, { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  imageLoader,
  modalOrderDetailStyle,
  modalStyle,
} from "@/features/img-loading";
import { FormatPrice } from "@/features/product/FilterAmount";
import { Total } from "@/features/cart/TotalPrice";
import { orderItem, productItemInOrder } from "@/features/types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { cancelOrder, getUserOrder } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { useRouter } from "next/navigation";

const OrderTracking = ({ orders }: { orders: orderItem[] }) => {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<productItemInOrder[] | null>(
    null
  );
  const [orderList, setOrderList] = useState<orderItem[]>(orders);
  const [open, setOpen] = useState<boolean>(false);
  const [openCancelOrder, setOpenCancelOrder] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [cancelOrderItem, setCancelOrderItem] = useState<orderItem | null>(
    null
  );

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
      warningMessage("Đang tải lại trang");
      router.refresh();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOrderDetail(null);
    setOpen(false);
  };

  const handleOpenCancelOrder = (item: orderItem) => {
    if (item.status !== "PROCESSING") {
      warningMessage("Không được phép hủy đơn hàng này");
    } else {
      setCancelOrderItem(item);
      setOpenCancelOrder(true);
    }
  };
  const handleCloseCancelOrder = () => {
    setCancelOrderItem(null);
    setOpenCancelOrder(false);
  };

  const handleCancelOrder = async (orderItem: orderItem) => {
    if (orderItem.status === "NOT_PROCESSED") {
      const res = await cancelOrder(
        orderItem.orderId,
        getCookie("accessToken")!
      );
      if (res.success) {
        successMessage("Hủy đơn hàng thành công");
        handleCloseDialog();
        setOrderList((prevItems: orderItem[]) =>
          prevItems.map((item: orderItem) =>
            item.orderId === res.result.orderId
              ? { ...item, status: res.result.status }
              : item
          )
        );
        router.refresh();
      } else if (res.statusCode == 401) {
        warningMessage("Đang tải lại trang");
        handleCloseDialog();
        router.refresh();
      } else if (res.statusCode == 500) {
        handleCloseDialog();
        errorMessage("Lỗi hệ thống");
      }
    } else if (orderItem.status === "PROCESSING") {
    }
  };

  const handleOpenDialog = (orderItem: orderItem) => {
    setOpenDialog(true);
    setCancelOrderItem(orderItem);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCancelOrderItem(null);
  };

  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
bg-white p-5 max-lg:px-10 rounded-sm mb-8 gap-y-1`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center pb-4 border-b-[0] lg:border-b border-border-color">
        Theo dõi đơn mua
      </h2>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="order-tracking-title"
        aria-describedby="order-tracking-description"
      >
        <Box className="relative" sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
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

      <Modal
        open={openCancelOrder}
        onClose={handleCloseCancelOrder}
        aria-labelledby="order-ifo-title"
        aria-describedby="order-info-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-secondary-color uppercase font-semibold text-center pb-4">
            Lý do hủy
          </h2>
          <FormControl sx={{ minHeight: "50vh" }} fullWidth>
            <RadioGroup name="address">
              {[
                "Tôi muốn cập nhật sđt/địa chỉ nhận hàng",
                "Thủ tục thanh toán rắc rối",
                "Tôi không có nhu cầu mua nữa",
              ].map((reason, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      index < 2 ? "border-b border-text-color " : ""
                    }py-2`}
                  >
                    <FormControlLabel
                      value={reason}
                      control={
                        <Radio
                          sx={{
                            "&, &.Mui-checked": {
                              color: "#f22a59",
                            },
                          }}
                        />
                      }
                      label={reason}
                    />
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
          <div className="w-full pt-4 flex justify-end gap-x-4 border-t border-border-color">
            <button
              onClick={handleCloseCancelOrder}
              className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md w-[6rem]"
            >
              Hủy
            </button>
            <button
              onClick={() => handleCancelOrder(cancelOrderItem!)}
              className="bg-secondary-color transition-all duration-200 hover:opacity-60 py-2 
                           float-right px-4 text-white rounded-md"
            >
              Xác nhận
            </button>
          </div>
        </Box>
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="cancel-order-title"
        aria-describedby="cancel-order-description"
      >
        <DialogTitle id="cancel-order-title">
          {"Xác nhận hủy đơn hàng này?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-order-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={() => handleCancelOrder(cancelOrderItem!)} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {orderList && orderList.length != 0 ? (
        <ul className="col-span-full h-[16rem] overflow-auto px-2">
          {orderList
            .filter(
              (order) =>
                order.status == "NOT_PROCESSED" ||
                order.status == "SHIPPING" ||
                order.status == "PROCESSING"
            )
            .sort((a, b) => b.orderId - a.orderId)
            .map((item: orderItem, index) => {
              if (
                index == 0 &&
                dayjs(new Date(item.createdAt!)).diff(dayjs(), "day") <= 1
              ) {
                return (
                  <li
                    key={`order-${item.orderId}`}
                    className="grid grid-cols-12 py-3 border-b border-text-light-color gap-y-2 bg-yellow-200 px-2"
                  >
                    <div className="col-span-8 md:col-span-5">
                      <h1 className="text-lg text-secondary-color">
                        ID Đơn mua: {item.orderId}{" "}
                        <span className="font-bold text-red">{`(Mới đặt)`}</span>
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
                        item.status == "PROCESSING"
                          ? "bg-yellow-500"
                          : item.status == "NOT_PROCESSED"
                          ? "bg-text-light-color"
                          : item.status == "SHIPPING" && "bg-purple-600"
                      }  grid place-content-center text-white rounded-lg`}
                    >
                      {item.status == "PROCESSING"
                        ? "Đang xử lý"
                        : item.status == "NOT_PROCESSED"
                        ? "Chưa xử lý"
                        : item.status == "SHIPPING" && "Đang giao hàng"}
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
                        onClick={() =>
                          item.status === "NOT_PROCESSED"
                            ? handleOpenDialog(item)
                            : handleOpenCancelOrder(item)
                        }
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
                        <CancelIcon />
                        <span className="text-lg pl-1">Hủy</span>
                      </Button>
                    </div>
                  </li>
                );
              }

              return (
                <li
                  key={`order-${item.orderId}`}
                  className="grid grid-cols-12 py-3 border-b border-text-light-color gap-y-2 px-2"
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
                      item.status == "PROCESSING"
                        ? "bg-yellow-500"
                        : item.status == "NOT_PROCESSED"
                        ? "bg-text-light-color"
                        : item.status == "SHIPPING" && "bg-purple-600"
                    }  grid place-content-center text-white rounded-lg`}
                  >
                    {item.status == "PROCESSING"
                      ? "Đang xử lý"
                      : item.status == "NOT_PROCESSED"
                      ? "Chưa xử lý"
                      : item.status == "SHIPPING" && "Đang giao hàng"}
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
                      onClick={() =>
                        item.status === "NOT_PROCESSED"
                          ? handleOpenDialog(item)
                          : handleOpenCancelOrder(item)
                      }
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
                      <CancelIcon />
                      <span className="text-lg pl-1">Hủy</span>
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="col-span-full min-h-[14rem] grid place-content-center">
          <Image alt="emptyOrder" src={empty_order}></Image>
          <span className="text-center mr-4 pt-2">Đơn mua trống</span>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
