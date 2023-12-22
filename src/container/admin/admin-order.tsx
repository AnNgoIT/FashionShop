"use client";
import Title from "@/components/dashboard/Title";
import { User, orderItem, productItemInOrder } from "@/features/types";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Total } from "@/features/cart/TotalPrice";
import {
  imageLoader,
  modalOrderChangeStyle,
  modalOrderDetailStyle,
  modalStyle,
} from "@/features/img-loading";
import { FormatPrice } from "@/features/product/FilterAmount";
import Toolbar from "@mui/material/Toolbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  deleteCookie,
  getCookie,
  getCookies,
  hasCookie,
  setCookie,
} from "cookies-next";
import dayjs from "dayjs";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { useRouter } from "next/navigation";
import { getDataAdmin, patchData } from "@/hooks/useAdmin";
import { decodeToken } from "@/features/jwt-decode";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomTabPanel, a11yProps } from "../shipper";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import { getAuthenticated } from "@/hooks/useData";

export type DeliveryDetail = {
  deliveryId: number;
  note: string | null;
  shipperEmail: string;
  isReceived: boolean;
  isDelivered: boolean;
  createdAt?: string;
  updatedAt?: string;
  address?: string;
  phone: string;
  orderId?: number;
  totalAmount?: number;
  shipperId?: string;
  recipientName: string;
  shipperName: string;
  checkoutStatus: boolean;
};

const AdminOrders = ({
  orders,
  token,
}: {
  orders: orderItem[];
  token?: { accessToken?: string; refreshToken?: string };
}) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<orderItem | null>(null);
  const [orderDetail, setOrderDetail] = useState<{
    order: orderItem;
    orderItems: productItemInOrder[];
  } | null>(null);
  const [deliveryDetail, setDeliveryDetail] = useState<DeliveryDetail | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderList, setOrderList] = useState<orderItem[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openShippingModal, setOpenShippingModal] = useState<boolean>(false);
  const [value, setValue] = React.useState(0);
  const [shipper, setShipper] = useState<{ fullname: string; email: string }>({
    fullname: "",
    email: "",
  });
  const [shipperList, setShipperList] = useState<User[]>([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPage(0);
    setRowsPerPage(5);
    setOrderList(orders || []);
    setValue(newValue);
  };

  useEffect(() => {
    setOrderList(orders);
    if (token && token.accessToken && token.refreshToken) {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken!)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken!)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, rowsPerPage, token]);

  const handleClose = () => {
    setOpen(false);
    setOrderDetail(null);
    setDeliveryDetail(null);
  };
  const handeCloseShipperForm = () => {
    setOpenShippingModal(false);
    setShipper({ fullname: "", email: "" });
    setShipperList([]);
  };

  const handleChangePage = (newOrders: orderItem[], newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newOrderList = newOrders.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setOrderList(newOrderList);
  };

  const handleChangeRowsPerPage = (
    newOrders: orderItem[],
    event: { target: { value: string } }
  ) => {
    setRowsPerPage(() => {
      setOrderList(newOrders.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  const handleOpenDialog = async (changeOrder: orderItem) => {
    setOpenDialog(true);
    setOrder(changeOrder);
  };

  const handleOpenShipperForm = async (changeOrder: orderItem) => {
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
    setOrder(changeOrder);
    setOpenShippingModal(true);
    const res = await getAuthenticated(
      `/api/v1/users/admin/user-management/users/address?address=${changeOrder.address
        .split("-")[1]
        .trim()}`,
      getCookie("accessToken")!
    );
    if (res.success) {
      setShipperList(res.result.userList);
    } else if (res.statusCode == 400) {
      errorMessage("Địa chỉ không hợp lệ");
      setShipperList([]);
    } else if (res.statusCode == 500) {
      errorMessage("Lỗi hệ thống");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrder(null);
  };

  async function openInfoModal(item: orderItem) {
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
    setOpen(true);
    const [orderDetailRes, shipperRes] = await Promise.all([
      getDataAdmin(
        `/api/v1/users/admin/orders/${item.orderId}`,
        getCookie("accessToken")!
      ),
      getDataAdmin(
        `/api/v1/users/admin/orders/${item.orderId}/delivery`,
        getCookie("accessToken")!
      ),
    ]);
    setOrderDetail(orderDetailRes.success ? orderDetailRes.result : null);
    setDeliveryDetail(shipperRes.success ? shipperRes.result : null);
  }

  async function handleUpdateOrder(event: any, order: orderItem) {
    event.preventDefault();
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

    const newStatus =
      order.status === "NOT_PROCESSED"
        ? "PROCESSING"
        : order.status === "PROCESSING"
        ? "SHIPPING"
        : order.status === "SHIPPING"
        ? "DELIVERED"
        : order.status;

    if (newStatus == "PROCESSING") {
      const changeOrderStatusToProcessing = await patchData(
        `/api/v1/users/admin/orders/toProcessing/${order.orderId}`,
        getCookie("accessToken")!,
        {}
      );
      if (changeOrderStatusToProcessing.success) {
        successMessage("Đổi trạng thái thành công");
        setOrderList((prevOrderItems) =>
          prevOrderItems.map((item) =>
            item.orderId === order.orderId
              ? { ...item, status: newStatus }
              : item
          )
        );
        router.refresh();
        handleCloseDialog();
      } else if (changeOrderStatusToProcessing.statusCode == 401) {
        warningMessage(
          "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
        );
        router.refresh();
      } else if (changeOrderStatusToProcessing.status == 500) {
        errorMessage("Lỗi hệ thống");
        router.refresh();
      } else if (changeOrderStatusToProcessing.status == 404) {
        errorMessage("Không tìm thấy đơn hàng này");
      } else errorMessage("Lỗi sai dữ liệu truyền");
    } else if (newStatus == "SHIPPING") {
      const changeOrderStatusToShipping = await patchData(
        `/api/v1/users/admin/orders/toShipping/${order.orderId}?shipperEmail=${shipper.email}`,
        getCookie("accessToken")!,
        {}
      );
      if (changeOrderStatusToShipping.success) {
        successMessage("Đổi trạng thái thành công");
        setOrderList((prevOrderItems) =>
          prevOrderItems.map((item) =>
            item.orderId === order.orderId
              ? { ...item, status: newStatus }
              : item
          )
        );
        handeCloseShipperForm();
        router.refresh();
        handleCloseDialog();
      } else if (changeOrderStatusToShipping.statusCode == 401) {
        warningMessage(
          "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
        );
        router.refresh();
      } else if (changeOrderStatusToShipping.status == 500) {
        errorMessage("Lỗi hệ thống");
        router.refresh();
      } else if (changeOrderStatusToShipping.status == 404) {
        errorMessage("Không tìm thấy đơn hàng này");
        router.refresh();
      } else errorMessage("Lỗi sai dữ liệu truyền");
    }
  }

  // function handleSearchOrders(e: { preventDefault: () => void }, id: string) {
  //   if (id == undefined) setOrderList(orders.slice(0, rowsPerPage));
  //   else {
  //     const newOrderList = orders.filter((item) =>
  //       item.orderId.toString().includes(id)
  //     );
  //     setOrderList(newOrderList);
  //   }
  // }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-address-title"
        aria-describedby="delete-address-description"
      >
        <DialogContent>
          <DialogTitle sx={{ textAlign: "center" }} id="delete-address-title">
            {`Xác nhận thay đổi trạng thái đơn hàng này?`}
          </DialogTitle>
          <DialogContentText id="delete-address-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={(e) => handleUpdateOrder(e, order!)} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Toolbar />
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
                {deliveryDetail && (
                  <>
                    <div className="flex justify-between text-text-light-color text-base p-1">
                      <span> Người giao hàng: </span>
                      <strong className="font-black">
                        {deliveryDetail.shipperName}
                      </strong>
                    </div>
                    <div className="flex justify-between text-text-light-color text-base p-1">
                      <span> Số điện thoại người giao </span>
                      <strong className="font-black">
                        {deliveryDetail.phone.length == 13
                          ? deliveryDetail.phone.slice(3, 13)
                          : deliveryDetail.phone}
                      </strong>
                    </div>
                    <div className="flex justify-between text-text-light-color text-base p-1">
                      <span> Nơi giao hàng: </span>
                      <strong className="font-black">
                        {deliveryDetail.address?.split(" - ")[1] || "Không có"}
                      </strong>
                    </div>
                    <div className="flex justify-between text-text-light-color text-base p-1">
                      <span> Email: </span>
                      <strong className="font-black">
                        {deliveryDetail.shipperEmail}
                      </strong>
                    </div>
                  </>
                )}

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
        open={openShippingModal}
        onClose={handeCloseShipperForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalOrderChangeStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Chọn người giao hàng
          </h2>
          <div className="col-span-full grid grid-flow-col grid-cols-12 ">
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <div className="col-span-full text-xl font-semibold py-4 text-secondary-color">
                {(shipper.fullname !== "" &&
                  "Email shipper: " +
                    shipperList.find(
                      (item) => item.fullname === shipper.fullname
                    )?.email) ||
                  ""}
              </div>
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="shipper">
                  Người giao hàng
                </InputLabel>
                <Select
                  required
                  id="shipper"
                  name="shipper"
                  value={shipper.fullname}
                  onChange={(e) =>
                    setShipper({
                      ...shipper,
                      fullname: e.target.value,
                      email:
                        shipperList.find(
                          (item) => item.fullname === e.target.value
                        )?.email || "",
                    })
                  }
                  input={<OutlinedInput label="Người giao hàng" />}
                >
                  {shipperList.map((shipper: User, index: number) => (
                    <MenuItem key={index} value={shipper.fullname || ""}>
                      <ListItemText primary={shipper.fullname} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="col-span-full flex gap-x-2 mt-8 justify-end items-center">
                <button
                  onClick={() => {
                    setShipperList([]);
                    setShipper({ fullname: "", email: "" });
                    setOpenShippingModal(false);
                  }}
                  className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                  type="button"
                >
                  Hủy
                </button>
                <button
                  onClick={(e) => handleUpdateOrder(e, order!)}
                  className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                  type="button"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Orders */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              // height: 240,
              overflow: "auto",
            }}
          >
            <Title>
              <div className="grid grid-cols-12 items-center">
                <span className="col-span-4">Danh sách đơn hàng</span>
              </div>
            </Title>
            <Box
              sx={{ borderBottom: 1, width: "100%", borderColor: "divider" }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="order-tabs"
              >
                <Tab label="Tất cả" sx={{ color: "black" }} {...a11yProps(0)} />
                <Tab
                  label="Chưa xử lý"
                  sx={{ color: "black" }}
                  {...a11yProps(1)}
                />
                <Tab
                  label="Đang xử lý"
                  sx={{ color: "black" }}
                  {...a11yProps(2)}
                />
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
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList.slice(0, rowsPerPage).map((item) => (
                      <TableRow key={item.orderId}>
                        <TableCell align="left">{item.fullName}</TableCell>
                        <TableCell align="left">
                          {dayjs(new Date(item.createdAt!)).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {item.address.split("-").length == 1
                            ? `${item.address}`
                            : `${item.address.split("-")[1]}, ${
                                item.address.split("-")[2]
                              }`}
                        </TableCell>
                        <TableCell align="left">
                          {item.paymentMethod === "COD"
                            ? "Thanh toán khi nhận"
                            : "Ví điện tử VNPay"}
                        </TableCell>
                        <TableCell
                          // suppressHydrationWarning={true}
                          align="left"
                        >{`${FormatPrice(item.totalAmount)} VNĐ`}</TableCell>
                        <TableCell sx={{ width: "10rem" }} align="left">
                          <FormControl sx={{ minWidth: "10rem" }}>
                            <div
                              className={`
                            p-2 text-white text-sm font-bold rounded-md ${
                              item.status == "NOT_PROCESSED"
                                ? "bg-text-light-color"
                                : item.status == "PROCESSING"
                                ? "bg-yellow-400"
                                : item.status == "SHIPPING"
                                ? "bg-purple-400"
                                : item.status == "DELIVERED"
                                ? "bg-green-400"
                                : item.status == "CANCELLED" &&
                                  "bg-secondary-color"
                            }
                            `}
                              id="status-select"
                            >
                              {item.status == "NOT_PROCESSED"
                                ? "Chưa xử lý"
                                : item.status == "PROCESSING"
                                ? "Đang xử lý"
                                : item.status == "SHIPPING"
                                ? "Đang giao hàng"
                                : item.status == "DELIVERED"
                                ? "Giao hàng thành công"
                                : item.status == "CANCELLED" &&
                                  "Đơn hàng bị hủy"}
                            </div>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                          <div className="flex justify-start items-center">
                            <Button
                              onClick={() => openInfoModal(item)}
                              sx={{
                                "&:hover": {
                                  color: "#999",
                                  opacity: "0.6",
                                  background: "white",
                                },
                                color: "#639df1",
                              }}
                            >
                              <InfoIcon />
                            </Button>
                            {item.status != "CANCELLED" &&
                              item.status != "DELIVERED" &&
                              item.status != "SHIPPING" && (
                                <Button
                                  onClick={(e) => {
                                    item.status == "PROCESSING"
                                      ? handleOpenShipperForm(item)
                                      : handleOpenDialog(item);
                                  }}
                                  sx={{
                                    "&:hover": {
                                      opacity: "0.6",
                                      background: "white",
                                    },
                                    color: "#639df1",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  Xác nhận
                                </Button>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={orders.length}
                page={page}
                onPageChange={(e, newPage) => handleChangePage(orders, newPage)}
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => handleChangeRowsPerPage(orders, e)}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList
                      .filter((order) => order.status == "NOT_PROCESSED")
                      .slice(0, rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.fullName}</TableCell>
                          <TableCell align="left">
                            {dayjs(new Date(item.createdAt!)).format(
                              "DD/MM/YYYY"
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.address.split("-").length == 1
                              ? `${item.address}`
                              : `${item.address.split("-")[1]}, ${
                                  item.address.split("-")[2]
                                }`}
                          </TableCell>
                          <TableCell align="left">
                            {item.paymentMethod === "COD"
                              ? "Thanh toán khi nhận"
                              : "Ví điện tử VNPay"}
                          </TableCell>
                          <TableCell align="left">{`${FormatPrice(
                            item.totalAmount
                          )} VNĐ`}</TableCell>
                          <TableCell sx={{ width: "10rem" }} align="left">
                            <FormControl sx={{ minWidth: "10rem" }}>
                              <div
                                className={`
                            p-2 text-white text-sm font-bold rounded-md bg-text-light-color`}
                                id="status-select"
                              >
                                Chưa xử lý
                              </div>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                            <div className="flex justify-start items-center">
                              <Button
                                onClick={() => openInfoModal(item)}
                                sx={{
                                  "&:hover": {
                                    color: "#999",
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                }}
                              >
                                <InfoIcon />
                              </Button>

                              <Button
                                onClick={(e) => {
                                  item.status == "PROCESSING"
                                    ? handleOpenShipperForm(item)
                                    : handleOpenDialog(item);
                                }}
                                sx={{
                                  "&:hover": {
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                  textTransform: "capitalize",
                                }}
                              >
                                Xác nhận
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={
                  orders.filter((order) => order.status == "NOT_PROCESSED")
                    .length
                }
                page={page}
                onPageChange={(e, newPage) =>
                  handleChangePage(
                    orders.filter((order) => order.status == "NOT_PROCESSED"),
                    newPage
                  )
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  handleChangeRowsPerPage(
                    orders.filter((order) => order.status == "NOT_PROCESSED"),
                    e
                  )
                }
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList
                      .filter((order) => order.status == "PROCESSING")
                      .slice(0, rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.fullName}</TableCell>
                          <TableCell align="left">
                            {dayjs(new Date(item.createdAt!)).format(
                              "DD/MM/YYYY"
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.address.split("-").length == 1
                              ? `${item.address}`
                              : `${item.address.split("-")[1]}, ${
                                  item.address.split("-")[2]
                                }`}
                          </TableCell>
                          <TableCell align="left">
                            {item.paymentMethod === "COD"
                              ? "Thanh toán khi nhận"
                              : "Ví điện tử VNPay"}
                          </TableCell>
                          <TableCell align="left">
                            {`${FormatPrice(item.totalAmount)} VNĐ`}
                          </TableCell>
                          <TableCell sx={{ width: "10rem" }} align="left">
                            <FormControl sx={{ minWidth: "10rem" }}>
                              <div
                                className={`
                            p-2 text-white text-sm font-bold rounded-md bg-yellow-400`}
                                id="status-select"
                              >
                                Đang xử lý
                              </div>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                            <div className="flex justify-start items-center">
                              <Button
                                onClick={() => openInfoModal(item)}
                                sx={{
                                  "&:hover": {
                                    color: "#999",
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                }}
                              >
                                <InfoIcon />
                              </Button>

                              <Button
                                onClick={(e) => {
                                  item.status == "PROCESSING"
                                    ? handleOpenShipperForm(item)
                                    : handleOpenDialog(item);
                                }}
                                sx={{
                                  "&:hover": {
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                  textTransform: "capitalize",
                                }}
                              >
                                Xác nhận
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={
                  orders.filter((order) => order.status == "PROCESSING").length
                }
                page={page}
                onPageChange={(e, newPage) =>
                  handleChangePage(
                    orders.filter((order) => order.status == "PROCESSING"),
                    newPage
                  )
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  handleChangeRowsPerPage(
                    orders.filter((order) => order.status == "PROCESSING"),
                    e
                  )
                }
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList
                      .filter((order) => order.status == "SHIPPING")
                      .slice(0, rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.fullName}</TableCell>
                          <TableCell align="left">
                            {dayjs(new Date(item.createdAt!)).format(
                              "DD/MM/YYYY"
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.address.split("-").length == 1
                              ? `${item.address}`
                              : `${item.address.split("-")[1]}, ${
                                  item.address.split("-")[2]
                                }`}
                          </TableCell>
                          <TableCell align="left">
                            {item.paymentMethod === "COD"
                              ? "Thanh toán khi nhận"
                              : "Ví điện tử VNPay"}
                          </TableCell>
                          <TableCell align="left">{`${FormatPrice(
                            item.totalAmount
                          )} VNĐ`}</TableCell>
                          <TableCell sx={{ width: "10rem" }} align="left">
                            <FormControl sx={{ minWidth: "10rem" }}>
                              <div
                                className={`
                            p-2 text-white text-sm font-bold rounded-md bg-purple-400`}
                                id="status-select"
                              >
                                Đang giao hàng
                              </div>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                            <div className="flex justify-start items-center">
                              <Button
                                onClick={() => openInfoModal(item)}
                                sx={{
                                  "&:hover": {
                                    color: "#999",
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                }}
                              >
                                <InfoIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={
                  orders.filter((order) => order.status == "SHIPPING").length
                }
                page={page}
                onPageChange={(e, newPage) =>
                  handleChangePage(
                    orders.filter((order) => order.status == "SHIPPING"),
                    newPage
                  )
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  handleChangeRowsPerPage(
                    orders.filter((order) => order.status == "SHIPPING"),
                    e
                  )
                }
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList
                      .filter((order) => order.status == "DELIVERED")
                      .slice(0, rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.fullName}</TableCell>
                          <TableCell align="left">
                            {dayjs(new Date(item.createdAt!)).format(
                              "DD/MM/YYYY"
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.address.split("-").length == 1
                              ? `${item.address}`
                              : `${item.address.split("-")[1]}, ${
                                  item.address.split("-")[2]
                                }`}
                          </TableCell>
                          <TableCell align="left">
                            {item.paymentMethod === "COD"
                              ? "Thanh toán khi nhận"
                              : "Ví điện tử VNPay"}
                          </TableCell>
                          <TableCell align="left">{`${FormatPrice(
                            item.totalAmount
                          )} VNĐ`}</TableCell>
                          <TableCell sx={{ width: "10rem" }} align="left">
                            <FormControl sx={{ minWidth: "10rem" }}>
                              <div
                                className={`p-2 text-white text-sm font-bold rounded-md bg-green-400`}
                                id="status-select"
                              >
                                Giao hàng thành công
                              </div>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                            <div className="flex justify-start items-center">
                              <Button
                                onClick={() => openInfoModal(item)}
                                sx={{
                                  "&:hover": {
                                    color: "#999",
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                }}
                              >
                                <InfoIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={
                  orders.filter((order) => order.status == "DELIVERED").length
                }
                page={page}
                onPageChange={(e, newPage) =>
                  handleChangePage(
                    orders.filter((order) => order.status == "DELIVERED"),
                    newPage
                  )
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  handleChangeRowsPerPage(
                    orders.filter((order) => order.status == "DELIVERED"),
                    e
                  )
                }
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "8rem" }} align="left">
                      Tên
                    </TableCell>
                    <TableCell sx={{ minWidth: "7rem" }} align="left">
                      Ngày đặt
                    </TableCell>
                    <TableCell sx={{ minWidth: "9rem" }} align="left">
                      Địa chỉ
                    </TableCell>
                    <TableCell sx={{ minWidth: "12rem" }} align="left">
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell sx={{ minWidth: "7.5rem" }} align="left">
                      Tổng tiền
                    </TableCell>
                    <TableCell align="left">Trạng thái</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList &&
                    orderList
                      .filter((order) => order.status == "CANCELLED")
                      .slice(0, rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.fullName}</TableCell>
                          <TableCell align="left">
                            {dayjs(new Date(item.createdAt!)).format(
                              "DD/MM/YYYY"
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.address.split("-").length == 1
                              ? `${item.address}`
                              : `${item.address.split("-")[1]}, ${
                                  item.address.split("-")[2]
                                }`}
                          </TableCell>
                          <TableCell align="left">
                            {item.paymentMethod === "COD"
                              ? "Thanh toán khi nhận"
                              : "Ví điện tử VNPay"}
                          </TableCell>
                          <TableCell align="left">{`${FormatPrice(
                            item.totalAmount
                          )} VNĐ`}</TableCell>
                          <TableCell sx={{ width: "10rem" }} align="left">
                            <FormControl sx={{ minWidth: "10rem" }}>
                              <div
                                className={`p-2 text-white text-sm font-bold rounded-md bg-secondary-color`}
                                id="status-select"
                              >
                                Đơn hàng bị hủy
                              </div>
                            </FormControl>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
                            <div className="flex justify-start items-center">
                              <Button
                                onClick={() => openInfoModal(item)}
                                sx={{
                                  "&:hover": {
                                    color: "#999",
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
                                }}
                              >
                                <InfoIcon />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <TablePagination
                sx={{ overflow: "visible" }}
                component="div"
                count={
                  orders.filter((order) => order.status == "CANCELLED").length
                }
                page={page}
                onPageChange={(e, newPage) =>
                  handleChangePage(
                    orders.filter((order) => order.status == "CANCELLED"),
                    newPage
                  )
                }
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  handleChangeRowsPerPage(
                    orders.filter((order) => order.status == "CANCELLED"),
                    e
                  )
                }
              />
            </CustomTabPanel>
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminOrders;
