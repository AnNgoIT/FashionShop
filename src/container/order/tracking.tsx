"use client";
import Image from "next/image";
import { empty_order } from "@/assests/images";
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
import { getCookie, hasCookie } from "cookies-next";
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
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: "4px 0 4px 4px" }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `order-tab-${index}`,
    "aria-controls": `order-tabpanel-${index}`,
  };
}

const OrderTracking = ({ orders }: { orders: orderItem[] }) => {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<{
    order: orderItem;
    orderItems: productItemInOrder[];
  } | null>(null);
  const [orderList, setOrderList] = useState<orderItem[]>(orders);
  const [open, setOpen] = useState<boolean>(false);
  const [openCancelOrder, setOpenCancelOrder] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [cancelOrderItem, setCancelOrderItem] = useState<orderItem | null>(
    null
  );
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (orders) {
      setOrderList(orders);
    }
  }, [orders]);
  const handleOpenDetail = async (item: orderItem) => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }
    setOpen(true);
    const res = await getUserOrder(item.orderId, getCookie("accessToken")!);
    if (res.success) {
      setOrderDetail(res.result);
    } else if (res.statusCode == 401) {
      warningMessage("Đang tải lại trang");
      router.refresh();
    }
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
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

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
        warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div
      className={`col-span-full sm:col-span-10 sm:col-start-2 lg:col-span-9 xl:col-span-8 grid grid-cols-12 shadow-hd
bg-white ssm:p-1 md:p-5 max-lg:px-10 rounded-sm mb-8 gap-y-1 h-fit`}
    >
      <h2
        className="col-span-full text-3xl tracking-[0] text-text-color 
        uppercase font-semibold text-left max-lg:text-center max-md:p-4 pb-4 border-b-[0] lg:border-b border-border-color
      h-fit"
      >
        Theo dõi đơn mua
      </h2>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="order-tracking-title"
        aria-describedby="order-tracking-description"
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
                      <div className="flex justify-between py-4">
                        <div className="flex gap-x-2">
                          <Image
                            className="outline outline-1 outline-secondary-color w-[6rem] h-[7rem] p-1"
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
      <Paper
        component={"div"}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0",
          // height: 240,
        }}
        className="col-span-full"
      >
        <Box sx={{ borderBottom: 1, width: "100%", borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="order-tabs"
          >
            <Tab label="Tất cả" sx={{ color: "black" }} {...a11yProps(0)} />
            <Tab label="Chưa xử lý" sx={{ color: "black" }} {...a11yProps(1)} />
            <Tab label="Đang xử lý" sx={{ color: "black" }} {...a11yProps(2)} />
            <Tab
              label="Đang giao hàng"
              sx={{ color: "black" }}
              {...a11yProps(3)}
            />
            <Tab
              label="Giao hàng thành công"
              sx={{ color: "black" }}
              {...a11yProps(4)}
            />
            <Tab label="Đã hủy" sx={{ color: "black" }} {...a11yProps(5)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {orderList && orderList.length > 0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .sort((a, b) => b.orderId - a.orderId)
                .map((item: orderItem, index) => {
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
                            : item.status == "SHIPPING"
                            ? "bg-purple-600"
                            : item.status == "DELIVERED"
                            ? "bg-green-500"
                            : item.status == "CANCELLED" && "bg-secondary-color"
                        }  grid place-content-center text-white rounded-lg`}
                      >
                        {item.status == "PROCESSING"
                          ? "Đang xử lý"
                          : item.status == "NOT_PROCESSED"
                          ? "Chưa xử lý"
                          : item.status == "SHIPPING"
                          ? "Đang giao hàng"
                          : item.status == "DELIVERED"
                          ? "Giao hàng thành công"
                          : item.status == "CANCELLED" && "Đã hủy"}
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
                        {item.status !== "SHIPPING" &&
                          item.status !== "PROCESSING" &&
                          item.status !== "DELIVERED" &&
                          item.status !== "CANCELLED" && (
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
                          )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">Đơn mua trống</span>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {orderList &&
          orderList.filter((order) => order.status == "NOT_PROCESSED").length >
            0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .filter((order) => order.status == "NOT_PROCESSED")
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
                          className={`col-span-4 md:col-span-2 text-center bg-text-color grid place-content-center text-white rounded-lg`}
                        >
                          Chưa xử lý
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
                        className={`col-span-4 md:col-span-2 text-center bg-text-light-color  grid place-content-center text-white rounded-lg`}
                      >
                        Chưa xử lý
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
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">
                Không có đơn hàng nào
              </span>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {orderList &&
          orderList.filter((order) => order.status == "PROCESSING").length >
            0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .filter((order) => order.status == "PROCESSING")
                .sort((a, b) => b.orderId - a.orderId)
                .map((item: orderItem, index) => {
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
                        className={`col-span-4 md:col-span-2 text-center bg-yellow-500 grid place-content-center text-white rounded-lg`}
                      >
                        Đang xử lý
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
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">
                Không có đơn hàng nào
              </span>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {orderList &&
          orderList.filter((order) => order.status == "SHIPPING").length > 0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .filter((order) => order.status == "SHIPPING")
                .sort((a, b) => b.orderId - a.orderId)
                .map((item: orderItem, index) => {
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
                        className={`col-span-4 md:col-span-2 text-center bg-purple-600 grid place-content-center text-white rounded-lg`}
                      >
                        Đang giao hàng
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
                        {/* <Button
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
                        </Button> */}
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">
                Không có đơn hàng nào
              </span>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          {orderList &&
          orderList.filter((order) => order.status == "DELIVERED").length >
            0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .filter((order) => order.status == "DELIVERED")
                .sort((a, b) => b.orderId - a.orderId)
                .map((item: orderItem, index) => {
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
                        className={`col-span-4 md:col-span-2 text-center bg-green-500
                        }  grid place-content-center text-white rounded-lg`}
                      >
                        Giao hàng thành công
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
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">
                Không có đơn hàng nào
              </span>
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          {orderList &&
          orderList.filter((order) => order.status == "CANCELLED").length >
            0 ? (
            <ul className="col-span-full h-[20rem] overflow-auto">
              {orderList
                .filter((order) => order.status == "CANCELLED")
                .sort((a, b) => b.orderId - a.orderId)
                .map((item: orderItem, index) => {
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
                        className={`col-span-4 md:col-span-2 text-center bg-secondary-color
                          grid place-content-center text-white rounded-lg`}
                      >
                        Đã hủy
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
                      </div>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div className="col-span-full h-[20rem] grid place-content-center">
              <Image
                className="w-full h-full"
                width={200}
                height={200}
                alt="emptyOrder"
                src={empty_order}
              ></Image>
              <span className="text-center mr-4 pt-2">
                Không có đơn hàng nào
              </span>
            </div>
          )}
        </CustomTabPanel>
      </Paper>
    </div>
  );
};

export default OrderTracking;
