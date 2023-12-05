"use client";
import Title from "@/components/dashboard/Title";
import { Order, orderItem, productItemInOrder } from "@/features/types";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import React, { useState } from "react";
import { product_1 } from "@/assests/images";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import NavigateButton from "@/components/button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CldImage } from "next-cloudinary";
import { getUserOrder } from "@/hooks/useAuth";
import { getCookie } from "cookies-next";
const AdminOrders = ({ orders }: { orders: orderItem[] }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [statusState, setStatusState] = useState<{ [orderId: number]: string }>(
    {}
  );
  const [orderDetail, setOrderDetail] = useState<productItemInOrder[] | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const [orderList, setOrderList] = useState<orderItem[]>(
    orders.slice(0, rowsPerPage)
  );
  const handleOpen = () => {
    setOpen(true);
  };
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

  const handleStatusChange = (orderId: number, selectedStatus: string) => {
    // Cập nhật trạng thái của đơn mua khi có sự thay đổi
    setStatusState((prevStatus: any) => ({
      ...prevStatus,
      [orderId]: selectedStatus,
    }));
  };

  async function openInfoModal(item: orderItem) {
    const res = await getUserOrder(item.orderId, getCookie("accessToken")!);
    if (res.success) {
      setOrderDetail(res.result.orderItems);
    }
    handleOpen();
  }

  function handleUpdateOrder(event: any) {
    event.preventDefault();
    const newOrderList = orders.map((item) => {
      if (statusState[item.orderId] !== undefined)
        item.status = statusState[item.orderId];
      return item;
    });

    const startIndex = page * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    setOrderList(newOrderList.slice(startIndex, startIndex + rowsPerPage));
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
      <Toolbar />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-left pb-4">
            Chi tiết đơn mua
          </h2>
          <ul>
            {orderDetail &&
              orderDetail.map((productItem) => {
                return (
                  <li className="w-full" key={productItem.orderItemId}>
                    <div className="flex justify-between p-2">
                      <div className="flex gap-x-2">
                        <CldImage
                          className="outline outline-1 outline-border-color w-[6rem] h-[7rem]"
                          src={productItem.image}
                          loader={imageLoader}
                          blurDataURL={productItem.image}
                          placeholder="blur"
                          width={100}
                          height={100}
                          alt={"productItemImg"}
                        ></CldImage>
                        <h1 className="text-sm text-secondary-color font-bold">
                          {productItem.productName}
                        </h1>
                      </div>
                      <span className="text-text-light-color text-md">{`x${productItem.quantity}`}</span>
                    </div>
                  </li>
                );
              })}
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
          </ul>
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Ngày đặt hàng</TableCell>
                  <TableCell align="center">Địa chỉ</TableCell>
                  <TableCell align="center">Số điện thoại</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList &&
                  orderList.map((item) => (
                    <TableRow key={item.orderId}>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell align="center">{""}</TableCell>
                      <TableCell sx={{ width: "10rem" }} align="center">
                        <FormControl sx={{ minWidth: "10rem" }}>
                          <Select
                            id="status-select"
                            value={statusState[item.orderId] || item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item.orderId,
                                e.target.value || item.status
                              )
                            }
                          >
                            <MenuItem value={"Not Processed"}>
                              Not Processed
                            </MenuItem>
                            <MenuItem value={"Processing"}>Processing</MenuItem>
                            <MenuItem value={"Shipping"}>Shipping</MenuItem>
                            <MenuItem value={"Delivered"}>Delivered</MenuItem>
                            <MenuItem value={"Canceled"}>Canceled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ width: "14rem" }} align="center">
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
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end pr-16">
              <NavigateButton onClick={(e) => handleUpdateOrder(e)}>
                Save
              </NavigateButton>
            </div>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={orders.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[1, 10, 25, 50]}
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
