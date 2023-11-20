"use client";
import Image from "next/image";
import { empty_order, product_1 } from "@/assests/images";
import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import CancelIcon from "@mui/icons-material/Cancel";
import { imageLoader, modalOrderDetailStyle } from "@/features/img-loading";
import { FormatPrice } from "@/features/product/FilterAmount";
import { Total } from "@/features/cart/TotalPrice";
import { orderItem } from "@/features/types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const OrderTracking = () => {
  const [orderDetail, setOrderDetail] = useState<orderItem | null>(null);
  const [orderList, setOrderList] = useState<orderItem[]>([
    {
      id: 20110456,
      orderDate: new Date(),
      status: "Pending",
      orderItemList: [
        {
          id: 1,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 2,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 3,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 4,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 5,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 6,
          name: "Women's Cape Jacket",
          price: 150000,
          quantity: 1,
          maxQuantity: 1,
        },
      ],
    },
    {
      id: 20110457,
      orderDate: new Date(),
      status: "Shipping",
      orderItemList: [
        {
          id: 1,
          name: "Men's Full Sleeves Collar Shirt",
          price: 100000,
          quantity: 1,
          maxQuantity: 2,
        },
        {
          id: 2,
          name: "Women's Cape Jacket",
          price: 150000,
          quantity: 1,
          maxQuantity: 1,
        },
      ],
    },
  ]);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenDetail = (item: orderItem) => {
    setOrderDetail(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOrderDetail(null);
    setOpen(false);
  };

  const handleCancelOrder = (id: number) => {
    const newOrderList = orderList.filter((item) => item.id != id);
    setOrderList(newOrderList);
  };
  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
bg-white p-5 max-lg:px-10 rounded-sm mb-8 gap-y-1`}
    >
      <h2 className="col-span-full text-3xl tracking-[0] text-text-color uppercase font-semibold text-left max-lg:text-center pb-4 border-b-[0] lg:border-b border-border-color">
        Order Tracking
      </h2>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-left pb-4">
            Order ID: {orderDetail?.id}
          </h2>
          <ul>
            {orderDetail?.orderItemList.map((orderItem) => {
              return (
                <li className="w-full" key={orderItem.id}>
                  <div className="flex justify-between p-2">
                    <div className="flex gap-x-2">
                      <Image
                        className="outline outline-1 outline-border-color w-[6rem] h-[7rem]"
                        src={product_1}
                        loader={imageLoader}
                        placeholder="blur"
                        width={100}
                        height={100}
                        alt={"orderItemImg"}
                      ></Image>
                      <h1 className="text-sm text-secondary-color font-bold">
                        {orderItem.name}
                      </h1>
                    </div>
                    <span className="text-text-light-color text-md">{`x${orderItem.quantity}`}</span>
                  </div>
                </li>
              );
            })}
            <div className="flex justify-between text-text-light-color text-xl font-bold p-2">
              <span> Shipping Cost: </span>
              <strong className="font-black">{FormatPrice(45000)} VNĐ</strong>
            </div>
            <div className="flex justify-between text-text-light-color text-xl font-bold p-2">
              <span> Total Cost:</span>
              <strong className="font-black">
                {orderDetail &&
                  orderDetail!.orderItemList &&
                  FormatPrice(Total(orderDetail.orderItemList))}
                VNĐ
              </strong>
            </div>
          </ul>
        </Box>
      </Modal>
      {orderList && orderList.length != 0 ? (
        <ul className="col-span-full h-[16rem] overflow-auto px-2">
          {orderList.map((item: orderItem) => {
            return (
              <li
                key={`order-${item.id}`}
                className="grid grid-cols-12 py-3 border-b border-text-light-color gap-y-2"
              >
                <div className="col-span-8 md:col-span-5">
                  <h1 className="text-lg text-secondary-color">
                    Order ID: {item.id}
                  </h1>
                  <h2>
                    Order Date:
                    {`${item.orderDate.getDay()}/${item.orderDate.getMonth()}/${item.orderDate.getFullYear()}`}
                  </h2>
                </div>
                <div
                  className={`col-span-4 md:col-span-2 text-center ${
                    item.status == "Pending" ? "bg-yellow-500" : "bg-green-500"
                  }  grid place-content-center text-white rounded-lg`}
                >
                  {item.status}
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
                    <span className="text-lg pl-1">Detail</span>
                  </Button>
                  <Button
                    onClick={() => handleCancelOrder(item.id)}
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
                    <span className="text-lg pl-1">Cancel</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="col-span-full min-h-[14rem] grid place-content-center">
          <Image alt="emptyOrder" src={empty_order}></Image>
          <span className="text-center mr-4 pt-2">Empty Order</span>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
