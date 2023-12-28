"use client";
import { deliveryItem, orderItem, productItemInOrder } from "@/features/types";
import InfoIcon from "@mui/icons-material/Info";
import React, { useEffect, useState } from "react";
import { FormatPrice } from "@/features/product/FilterAmount";
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
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { useRouter } from "next/navigation";
import { getDataAdmin, patchData } from "@/hooks/useAdmin";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { decodeToken } from "@/features/jwt-decode";
import {
  setCookie,
  getCookie,
  getCookies,
  deleteCookie,
  hasCookie,
} from "cookies-next";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import { imageLoader, modalOrderDetailStyle } from "@/features/img-loading";
import Image from "next/image";
import { Total } from "@/features/cart/TotalPrice";
import { logout } from "@/hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`delivery-tabpanel-${index}`}
      aria-labelledby={`delivery-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `delivery-tab-${index}`,
    "aria-controls": `delivery-tabpanel-${index}`,
  };
}

const Shipper = ({
  deliveries,
  token,
}: {
  deliveries: deliveryItem[];
  token?: { accessToken?: string; refreshToken?: string };
}) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<deliveryItem | null>(null);
  const [deliveryDetail, setDeliveryDetail] = useState<{
    order: orderItem;
    orderItems: productItemInOrder[];
  } | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deliveryList, setDeliveryList] = useState<deliveryItem[]>(
    deliveries.sort((a, b) => b.orderId - a.orderId)
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    deliveries && deliveries.length > 0 && setDeliveryList(deliveries);
    if (token && token.accessToken && token.refreshToken) {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveries, rowsPerPage, token]);

  const handleClose = () => {
    setOpen(false);
    setOrder(null);
    setDeliveryDetail(null);
  };

  const handleLogout = async () => {
    const cookies = getCookies();
    const res = await logout(cookies.accessToken!, cookies.refreshToken!);
    if (res.success) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      successMessage("Đăng xuất thành công");
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
      router.push("/");
    } else if (res.statusCode == 401) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      router.push("/login");
      router.refresh();
    }
  };

  const handleChangePage = (newDeliveries: deliveryItem[], newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newDeliveryList = newDeliveries.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setDeliveryList(newDeliveryList);
  };

  const handleChangeRowsPerPage = (
    newDeliveries: deliveryItem[],
    event: { target: { value: string } }
  ) => {
    setRowsPerPage(() => {
      setDeliveryList(newDeliveries.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  const handleOpenDialog = (changeOrder: deliveryItem) => {
    setOpenDialog(true);
    setOrder(changeOrder);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrder(null);
  };

  async function openInfoModal(item: deliveryItem) {
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
    try {
      setOpen(true);
      const res = await getDataAdmin(
        `/api/v1/users/shippers/deliveries/${item.deliveryId}`,
        getCookie("accessToken")!
      );
      if (res.success) {
        setDeliveryDetail(res.result);
      } else if (res.statusCode == 401) {
        warningMessage("Phiên đăng nhập hết hạn, đang tạo phiên mới");
        router.refresh();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateDelivery(event: any, delivery: deliveryItem) {
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
    if (delivery.isReceived === false && delivery.isDelivered === false) {
      try {
        const shipperReceived = await patchData(
          `/api/v1/users/shippers/deliveries/${delivery.deliveryId}/receive`,
          getCookie("accessToken")!,
          {}
        );
        if (shipperReceived.success) {
          successMessage("Đổi tình trạng thành công");
          setDeliveryList((prevdeliveryItems) =>
            prevdeliveryItems.map((item) =>
              item.deliveryId === delivery.deliveryId
                ? { ...item, isReceived: true }
                : item
            )
          );
          router.refresh();
          handleCloseDialog();
        } else if (shipperReceived.statusCode == 401) {
          warningMessage(
            "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
          );
          router.refresh();
        } else if (shipperReceived.status == 500) {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        } else if (shipperReceived.status == 404) {
          errorMessage("Không tìm thấy đơn giao này");
        } else errorMessage("Lỗi sai dữ liệu truyền");
      } catch (e) {
        console.error(e);
      }
    } else if (delivery.isReceived === true && delivery.isDelivered === false) {
      try {
        const shipperDelivered = await patchData(
          `/api/v1/users/shippers/deliveries/${delivery.deliveryId}/deliver`,
          getCookie("accessToken")!,
          {}
        );
        if (shipperDelivered.success) {
          successMessage("Đổi tình trạng thành công");
          setDeliveryList((prevdeliveryItems) =>
            prevdeliveryItems.map((item) =>
              item.deliveryId === delivery.deliveryId
                ? { ...item, isDelivered: true }
                : item
            )
          );
          router.refresh();
          handleCloseDialog();
        } else if (shipperDelivered.statusCode == 401) {
          warningMessage(
            "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
          );
          router.refresh();
        } else if (shipperDelivered.status == 500) {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        } else if (shipperDelivered.status == 404) {
          errorMessage("Không tìm thấy đơn giao này");
        } else errorMessage("Lỗi sai dữ liệu truyền");
      } catch (e) {
        console.error(e);
      }
    }
  }
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: "#e5e5e5",
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
            {`Xác nhận thay đổi tình trạng đơn giao này?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-address-description"></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={(e) => handleUpdateDelivery(e, order!)} autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
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
            {deliveryDetail && deliveryDetail.orderItems.length > 0 ? (
              <>
                <ul className="min-h-[19rem]">
                  {deliveryDetail.orderItems.map((productItem) => {
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
                            <div className="flex flex-col gap-y-2 p-0.5">
                              <h1 className="text-sm text-secondary-color font-bold">
                                {productItem.productName}
                              </h1>
                              <h2 className="text-sm text-secondary-color font-bold">
                                Phân loại: {productItem.styleValues.join(", ")}
                              </h2>
                            </div>
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
                      {deliveryDetail &&
                        FormatPrice(Total(deliveryDetail.orderItems))}
                      VNĐ
                    </strong>
                  </div>
                  <div className="flex justify-between text-text-light-color text-base p-1">
                    <span> Phí vận chuyển: </span>
                    <strong className="font-black">
                      {deliveryDetail &&
                        FormatPrice(
                          deliveryDetail.order.shippingCost || 0
                        )}{" "}
                      VNĐ
                    </strong>
                  </div>
                  <div className="flex justify-between text-text-light-color text-base p-1">
                    <span> Phương thức thanh toán: </span>
                    <strong className="font-black">
                      {deliveryDetail?.order.paymentMethod == "COD"
                        ? "Thanh toán khi nhận"
                        : "Ví điện tử VNPay"}
                    </strong>
                  </div>
                  <div className="flex justify-between text-secondary-color text-xl font-bold p-1">
                    <span> Thành tiền: </span>
                    <strong className="font-black">
                      {deliveryDetail &&
                        FormatPrice(
                          Total(deliveryDetail.orderItems) +
                            deliveryDetail.order.shippingCost || 0
                        )}
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
        <div className="min-h-[4rem] bg-primary-color text-white flex justify-between items-center p-4">
          <Typography
            color="inherit"
            noWrap
            sx={{
              flexGrow: 0,
              textTransform: "capitalize",
              fontSize: "1.25rem",
            }}
          >
            {deliveries && deliveries.length > 0
              ? deliveries[0].shipperName
              : ""}
          </Typography>
          <Typography
            onClick={handleLogout}
            component="button"
            color="inherit"
            noWrap
            sx={{
              flexGrow: 0,
              textTransform: "capitalize",
              fontSize: "1.25rem",
              "&:hover": {
                opacity: 0.6,
                cursor: "pointer",
              },
            }}
          >
            Đăng xuất
          </Typography>
        </div>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              component={"div"}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                // height: 240,
                overflow: "auto",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Tất cả"
                    sx={{ color: "black" }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Chờ xác nhận"
                    sx={{ color: "black" }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Chờ giao"
                    sx={{ color: "black" }}
                    {...a11yProps(1)}
                  />
                  <Tab
                    label="Giao thành công"
                    sx={{ color: "black" }}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Mã đơn hàng</TableCell>
                      <TableCell align="left">Tên người nhận</TableCell>
                      <TableCell align="left">Địa chỉ</TableCell>
                      <TableCell align="left">Số điện thoại</TableCell>
                      <TableCell align="left">Tình trạng thanh toán</TableCell>
                      <TableCell align="left">Tổng tiền</TableCell>
                      <TableCell align="left">Tình trạng đơn hàng</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryList &&
                      deliveryList.slice(0, rowsPerPage).map((item) => (
                        <TableRow key={item.orderId}>
                          <TableCell align="left">{item.orderId}</TableCell>
                          <TableCell align="left">
                            {item.recipientName}
                          </TableCell>
                          <TableCell sx={{ width: "12rem" }} align="left">
                            {item.address}
                          </TableCell>
                          <TableCell align="left">
                            {item.phone.length == 13
                              ? item.phone.slice(3, 13)
                              : item.phone}
                          </TableCell>
                          <TableCell align="left">
                            {item.checkoutStatus
                              ? "Đã thanh toán trước"
                              : "Chưa thanh toán"}
                          </TableCell>
                          <TableCell
                            suppressHydrationWarning
                            sx={{ width: "10rem" }}
                            align="left"
                          >{`${FormatPrice(item.totalAmount)} VNĐ`}</TableCell>
                          <TableCell sx={{ width: "13rem" }} align="left">
                            <div
                              className={`
                            p-2 text-lg font-bold rounded-md`}
                            >
                              {item.isReceived == false
                                ? "Chờ xác nhận"
                                : item.isReceived == true &&
                                  item.isDelivered == false
                                ? "Chờ giao"
                                : "Giao thành công"}
                            </div>
                          </TableCell>
                          <TableCell sx={{ minWidth: "12.5rem" }} align="left">
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  sx={{ overflow: "visible" }}
                  component="div"
                  count={deliveries.length}
                  page={page}
                  onPageChange={(e, newPage) =>
                    handleChangePage(deliveries, newPage)
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) =>
                    handleChangeRowsPerPage(deliveries, e)
                  }
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Mã đơn hàng</TableCell>
                      <TableCell align="left">Tên người nhận</TableCell>
                      <TableCell align="left">Địa chỉ</TableCell>
                      <TableCell align="left">Số điện thoại</TableCell>
                      <TableCell align="left">Tình trạng thanh toán</TableCell>
                      <TableCell align="left">Tổng tiền</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryList &&
                      deliveryList
                        .filter(
                          (delivery: any) =>
                            delivery.isReceived == false &&
                            delivery.isDelivered == false
                        )
                        .slice(0, rowsPerPage)
                        .map((item) => (
                          <TableRow key={item.orderId}>
                            <TableCell align="left">{item.orderId}</TableCell>
                            <TableCell align="left">
                              {item.recipientName}
                            </TableCell>
                            <TableCell sx={{ width: "12rem" }} align="left">
                              {item.address}
                            </TableCell>
                            <TableCell align="left">
                              {item.phone.length == 13
                                ? item.phone.slice(3, 13)
                                : item.phone}
                            </TableCell>
                            <TableCell align="left">
                              {item.checkoutStatus
                                ? "Đã thanh toán trước"
                                : "Chưa thanh toán"}
                            </TableCell>
                            <TableCell
                              suppressHydrationWarning
                              sx={{ width: "10rem" }}
                              align="left"
                            >{`${FormatPrice(
                              item.totalAmount
                            )} VNĐ`}</TableCell>
                            <TableCell
                              sx={{ minWidth: "12.5rem" }}
                              align="left"
                            >
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
                    deliveryList.filter(
                      (delivery: any) =>
                        delivery.isReceived == false &&
                        delivery.isDelivered == false
                    ).length
                  }
                  page={page}
                  onPageChange={(e, newPage) =>
                    handleChangePage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == false &&
                          delivery.isDelivered == false
                      ),
                      newPage
                    )
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) =>
                    handleChangeRowsPerPage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == false &&
                          delivery.isDelivered == false
                      ),
                      e
                    )
                  }
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Mã đơn hàng</TableCell>
                      <TableCell align="left">Tên người nhận</TableCell>
                      <TableCell align="left">Địa chỉ</TableCell>
                      <TableCell align="left">Số điện thoại</TableCell>
                      <TableCell align="left">Tình trạng thanh toán</TableCell>
                      <TableCell align="left">Tổng tiền</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryList &&
                      deliveryList
                        .filter(
                          (delivery: any) =>
                            delivery.isReceived == true &&
                            delivery.isDelivered == false
                        )
                        .slice(0, rowsPerPage)
                        .map((item) => (
                          <TableRow key={item.orderId}>
                            <TableCell align="left">{item.orderId}</TableCell>
                            <TableCell align="left">
                              {item.recipientName}
                            </TableCell>
                            <TableCell sx={{ width: "12rem" }} align="left">
                              {item.address}
                            </TableCell>
                            <TableCell align="left">
                              {item.phone.length == 13
                                ? item.phone.slice(3, 13)
                                : item.phone}
                            </TableCell>
                            <TableCell align="left">
                              {item.checkoutStatus
                                ? "Đã thanh toán trước"
                                : "Chưa thanh toán"}
                            </TableCell>
                            <TableCell
                              suppressHydrationWarning
                              sx={{ width: "10rem" }}
                              align="left"
                            >{`${FormatPrice(
                              item.totalAmount
                            )} VNĐ`}</TableCell>
                            <TableCell
                              sx={{ minWidth: "12.5rem" }}
                              align="left"
                            >
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
                                <Button
                                  onClick={() => handleOpenDialog(item)}
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
                    deliveryList.filter(
                      (delivery: any) =>
                        delivery.isReceived == true &&
                        delivery.isDelivered == false
                    ).length
                  }
                  page={page}
                  onPageChange={(e, newPage) =>
                    handleChangePage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == true &&
                          delivery.isDelivered == false
                      ),
                      newPage
                    )
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) =>
                    handleChangeRowsPerPage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == true &&
                          delivery.isDelivered == false
                      ),
                      e
                    )
                  }
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Mã đơn hàng</TableCell>
                      <TableCell align="left">Tên người nhận</TableCell>
                      <TableCell align="left">Địa chỉ</TableCell>
                      <TableCell align="left">Số điện thoại</TableCell>
                      <TableCell align="left">Tổng tiền</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryList &&
                      deliveryList
                        .filter(
                          (delivery: any) =>
                            delivery.isReceived == true &&
                            delivery.isDelivered == true
                        )
                        .slice(0, rowsPerPage)
                        .map((item) => (
                          <TableRow key={item.orderId}>
                            <TableCell align="left">{item.orderId}</TableCell>
                            <TableCell align="left">
                              {item.recipientName}
                            </TableCell>
                            <TableCell sx={{ width: "12rem" }} align="left">
                              {item.address}
                            </TableCell>
                            <TableCell align="left">
                              {item.phone.length == 13
                                ? item.phone.slice(3, 13)
                                : item.phone}
                            </TableCell>
                            <TableCell
                              suppressHydrationWarning
                              sx={{ width: "10rem" }}
                              align="left"
                            >{`${FormatPrice(
                              item.totalAmount
                            )} VNĐ`}</TableCell>
                            <TableCell
                              sx={{ minWidth: "12.5rem" }}
                              align="left"
                            >
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
                    deliveryList.filter(
                      (delivery: any) =>
                        delivery.isReceived == true &&
                        delivery.isDelivered == true
                    ).length
                  }
                  page={page}
                  onPageChange={(e, newPage) =>
                    handleChangePage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == true &&
                          delivery.isDelivered == true
                      ),
                      newPage
                    )
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) =>
                    handleChangeRowsPerPage(
                      deliveryList.filter(
                        (delivery: any) =>
                          delivery.isReceived == true &&
                          delivery.isDelivered == true
                      ),
                      e
                    )
                  }
                />
              </CustomTabPanel>
            </Paper>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Shipper;
