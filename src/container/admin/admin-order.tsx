"use client";
import Title from "@/components/dashboard/Title";
import { orderItem, productItemInOrder } from "@/features/types";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Total } from "@/features/cart/TotalPrice";
import { imageLoader, modalOrderDetailStyle } from "@/features/img-loading";
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
import { getCookie, setCookie } from "cookies-next";
import dayjs from "dayjs";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { useRouter } from "next/navigation";
import { getDataAdmin, patchData } from "@/hooks/useAdmin";
import { decodeToken } from "@/features/jwt-decode";
import { ACCESS_MAX_AGE, REFRESH_MAX_AGE } from "@/hooks/useData";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
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
  const [orderDetail, setOrderDetail] = useState<productItemInOrder[] | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderList, setOrderList] = useState<orderItem[]>(
    orders.slice(0, rowsPerPage)
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    orders && orders.length > 0 && setOrderList(orders.slice(0, rowsPerPage));
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
    } 


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, rowsPerPage, token]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newOrderList = orders.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setOrderList(newOrderList);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setOrderList(orders.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  const handleOpenDialog = (changeOrder: orderItem) => {
    setOpenDialog(true);
    setOrder(changeOrder);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrder(null);
  };

  async function openInfoModal(item: orderItem) {
    const res = await getDataAdmin(
      `/api/v1/users/admin/orders/${item.orderId}`,
      getCookie("accessToken")!
    );
    if (res.success) {
      setOrderDetail(res.result.orderItems);
    } else if (res.statusCode == 401) {
      warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
      router.refresh();
    }
    setOpen(true);
  }

  async function handleUpdateOrder(event: any, order: orderItem) {
    event.preventDefault();
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
        `/api/v1/users/admin/orders/toShipping/${
          order.orderId
        }?address=${order.address.split("-")[1].trim()}`,
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

    // setOrderList((prevOrderItems) =>
    //   prevOrderItems.map((item) =>
    //     item.orderId === order.orderId ? { ...item, status: newStatus } : item
    //   )
    // );
    // handleCloseDialog();
    // router.refresh();
    // const startIndex = page * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    // setOrderList(newOrderList.slice(startIndex, startIndex + rowsPerPage));
  }

  function handleSearchOrders(e: { preventDefault: () => void }, id: string) {
    if (id == undefined) setOrderList(orders.slice(0, rowsPerPage));
    else {
      const newOrderList = orders.filter((item) =>
        item.orderId.toString().includes(id)
      );
      setOrderList(newOrderList);
    }
  }

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
        <DialogTitle sx={{ textAlign: "center" }} id="delete-address-title">
          {`Xác nhận thay đổi trạng thái đơn hàng này?`}
        </DialogTitle>
        <DialogContent>
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
        <Box className="relative" sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Chi tiết đơn hàng
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
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newOrders) =>
                    handleSearchOrders(e, newOrders?.orderId.toString()!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined || option.orderId == value.orderId
                  }
                  options={orders}
                  getOptionLabel={(option) => option.orderId.toString()}
                  renderInput={(params) => (
                    <TextField {...params} label="Orders" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.orderId}
                        className="flex justify-between items-center px-3 py-2 border-b border-border-color"
                      >
                        <span key={`product-name-${option.orderId}`}>
                          {option.orderId}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.orderId}
                        label={option.orderId}
                      />
                    ));
                  }}
                />
              </div>
            </Title>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Tên khách hàng</TableCell>
                  <TableCell align="center">Ngày đặt hàng</TableCell>
                  <TableCell align="center">Địa chỉ</TableCell>
                  <TableCell align="center">Phương thức thanh toán</TableCell>
                  <TableCell align="center">Tổng tiền</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList &&
                  orderList.map((item) => (
                    <TableRow key={item.orderId}>
                      <TableCell align="center">{item.fullName}</TableCell>
                      <TableCell align="center">
                        {dayjs(new Date(item.createdAt!)).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell sx={{ width: "12rem" }} align="center">
                        {item.address}
                      </TableCell>
                      <TableCell align="center">
                        {item.paymentMethod === "COD"
                          ? "Thanh toán khi nhận"
                          : "Ví điện tử VNPay"}
                      </TableCell>
                      <TableCell
                        sx={{ width: "10rem" }}
                        align="center"
                      >{`${FormatPrice(item.totalAmount)} VNĐ`}</TableCell>
                      <TableCell sx={{ width: "10rem" }} align="center">
                        <FormControl sx={{ minWidth: "10rem" }}>
                          <div
                            className={`
                            p-2 text-white text-lg font-bold rounded-md ${
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
                              : item.status == "CANCELLED" && "Đơn hàng bị hủy"}
                          </div>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ minWidth: "12.5rem" }} align="center">
                        <div className="flex justify-between items-center gap-x-2">
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
                            item.status != "DELIVERED" && (
                              <Button
                                onClick={(e) => handleOpenDialog(item)}
                                sx={{
                                  "&:hover": {
                                    opacity: "0.6",
                                    background: "white",
                                  },
                                  color: "#639df1",
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
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminOrders;
