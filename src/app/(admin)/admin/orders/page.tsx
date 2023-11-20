"use client";
import Title from "@/components/dashboard/Title";
import { Order, orderItem } from "@/features/types";
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
import { user_img1 } from "@/assests/users";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const AdminOrdersPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [statusState, setStatusState] = useState<{ [orderId: number]: string }>(
    {}
  );
  const [orderDetail, setOrderDetail] = useState<orderItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const orders = [
    {
      id: 1,
      amount: 10,
      orderItem: {
        id: 20110456,
        orderDate: new Date(),
        status: "Not Processed",
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
      address: "Ha Noi",
      phone: "0909090909",
      status: "Not Processed",
    },
    {
      id: 2,
      amount: 20,
      orderItem: {
        id: 20110457,
        orderDate: new Date(),
        status: "Not Processed",
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
        ],
      },
      address: "Ha Noi",
      phone: "0909090909",
      status: "Processing",
    },
  ];
  const [orderList, setOrderList] = useState<Order[]>(
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

  function openInfoModal(item: orderItem) {
    setOrderDetail(item);
    handleOpen();
  }

  function handleUpdateOrder(event: any) {
    event.preventDefault();
    const newOrderList = orders.map((item) => {
      if (statusState[item.id] !== undefined)
        item.status = statusState[item.id];
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
        item.id.toString().includes(id)
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
                <span className="col-span-4"> Orders List</span>
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newOrders) =>
                    handleSearchOrders(e, newOrders?.id.toString()!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined || option.id == value.id
                  }
                  options={orders}
                  getOptionLabel={(option) => option.id.toString()}
                  renderInput={(params) => (
                    <TextField {...params} label="Orders" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.id}
                        className="flex justify-between items-center px-3 py-2 border-b border-border-color"
                      >
                        <span key={`product-name-${option.id}`}>
                          {option.id}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={option.id}
                      />
                    ));
                  }}
                />
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Address</TableCell>
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList &&
                  orderList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{item.amount}</TableCell>
                      <TableCell align="center">{item.address}</TableCell>
                      <TableCell align="center">{item.phone}</TableCell>
                      <TableCell sx={{ width: "10rem" }} align="center">
                        <FormControl sx={{ minWidth: "10rem" }}>
                          <Select
                            id="status-select"
                            value={statusState[item.id] || item.status}
                            onChange={(e) =>
                              handleStatusChange(
                                item.id,
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
                          onClick={() => openInfoModal(item.orderItem)}
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

export default AdminOrdersPage;
