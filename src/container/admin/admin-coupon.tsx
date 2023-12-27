"use client";
import Title from "@/components/dashboard/Title";
import EditIcon from "@mui/icons-material/Edit";
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
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useEffect, useState } from "react";
import { modalOrderDetailStyle, modalStyle } from "@/features/img-loading";
import { Category, Coupon, SaleBanner } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import { createData, getDataAdmin, patchData } from "@/hooks/useAdmin";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { decodeToken } from "@/features/jwt-decode";
import { warningMessage, errorMessage } from "@/features/toasting";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import isLeapYear from "dayjs/plugin/isLeapYear"; // import plugin
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("en"); // use locale

type AdminCouponProps = {
  coupons: Coupon[];
  banners: SaleBanner[];
  categories: Category[];
  token?: { accessToken?: string; refreshToken?: string };
};

type CreateCoupon = {
  couponId: string;
  bannerId: number;
  startAt: string | Date;
  expireAt: string | Date;
  discount: number;
  categoryIds: number[];
};

type CouponDetail = {
  categoryNames: string[];
  bannerId: number;
  discount: number;
  couponId: string;
  starAt: Date;
  expireAt: Date;
};

const AdminCoupon = (props: AdminCouponProps) => {
  const { coupons, banners, categories, token } = props;
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon>({
    couponId: "",
    discount: 0,
    checkCoupon: false,
    isActive: false,
  });
  const [couponDetail, setCouponDetail] = useState<CouponDetail | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [createCoupon, setCreateCoupon] = useState<CreateCoupon>({
    couponId: "",
    bannerId: 1,
    startAt: new Date(),
    expireAt: new Date(),
    discount: 0,
    categoryIds: [],
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [couponList, setCouponList] = useState<Coupon[]>(
    coupons.slice(0, rowsPerPage)
  );

  useEffect(() => {
    coupons &&
      coupons.length > 0 &&
      setCouponList(coupons.slice(0, rowsPerPage));
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
  }, [coupons, rowsPerPage, token]);

  function resetCoupon() {
    setCoupon({
      couponId: "",
      discount: 0,
      checkCoupon: false,
      isActive: false,
    });
    setCreateCoupon({
      couponId: "",
      bannerId: 1,
      startAt: "",
      expireAt: "",
      discount: 0,
      categoryIds: [],
    });
    setDiscountError("");
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetCoupon();
    setOpen(false);
  };

  const handleCloseDetail = () => {
    setCouponDetail(null);
    setOpenDetail(false);
  };

  const handleOpenDialog = async (coupon: Coupon) => {
    setOpenDialog(true);
    setCoupon(coupon);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCoupon({
      couponId: "",
      discount: 0,
      checkCoupon: false,
      isActive: false,
    });
  };

  const handleCoupon = (e: any) => {
    const value = e.target.value;
    if (e.target.name == "discount") {
      setDiscountError("");
    }
    setCreateCoupon({
      ...createCoupon,
      [e.target.name]: value,
    });
  };

  const handleCategoriesChange = (
    event: SelectChangeEvent<typeof createCoupon.categoryIds>
  ) => {
    const {
      target: { value },
    } = event;
    setCreateCoupon({
      ...createCoupon,
      categoryIds: typeof value === "string" ? [+value.split(",")] : value,
    });
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newCouponList = coupons.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setCouponList(newCouponList);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setCouponList(coupons.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  let isUpdating = false;
  async function handleUpdateCoupon(event: any, updateCoupon: Coupon) {
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
    if (isUpdating) return;
    isUpdating = true;
    try {
      let checkCoupon = updateCoupon.checkCoupon ? "revoke" : "grant";
      const id = toast.loading("Vui lòng chờ...");
      const update = await patchData(
        `/api/v1/users/admin/coupons/${updateCoupon?.couponId}/${checkCoupon}`,
        getCookie("accessToken")!,
        {}
      );
      handleCloseDialog();
      if (update.success) {
        toast.update(id, {
          render: `${
            checkCoupon ? "Thu hồi " : "Triển khai "
          }mã giảm giá thành công`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        router.refresh();
      } else if (update.status == 500) {
        errorMessage("Lỗi hệ thống");
        router.refresh();
      } else if (update.status == 404) {
        errorMessage("Không tìm thấy coupon này");
        router.refresh();
      } else errorMessage("Mã coupon mới phải khác với các mã coupon cũ");
    } catch (e) {
      toast.dismiss();
      console.error(e);
    } finally {
      isUpdating = false;
    }
  }

  let isCreating = false;
  async function handleCreateCoupon(e: { preventDefault: () => void }) {
    e.preventDefault();
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
    if (isCreating) return;
    isCreating = true;
    const payload: CreateCoupon = {
      ...createCoupon,
      discount: createCoupon.discount / 100,
      startAt: dayjs(createCoupon.startAt).format("YYYY-MM-DD"),
      expireAt: dayjs(createCoupon.expireAt).format("YYYY-MM-DD"),
    };

    if (payload.discount <= 0) {
      setDiscountError("Phần trăm giảm giá phải lớn hơn 0");
      return;
    }
    try {
      const id = toast.loading("Đang tạo...");
      const res = await createData(
        "/api/v1/users/admin/coupons",
        getCookie("accessToken")!,
        payload,
        "application/json"
      );
      handleClose();
      if (res.success) {
        toast.update(id, {
          render: `Tạo coupon mới thành công`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        router.refresh();
      } else if (res.statusCode == 403 || res.statusCode == 401) {
        toast.update(id, {
          render: `Phiên đăng nhập hết hạn, đang tạo phiên mới`,
          type: "warning",
          autoClose: 500,
          isLoading: false,
        });
        router.refresh();
      } else if (res.statusCode == 409) {
        toast.update(id, {
          render: "Coupon này đã tồn tại",
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
      } else {
        toast.update(id, {
          render: "Lỗi hệ thống",
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
      }
    } catch (e) {
      toast.dismiss();
      console.error(e);
    } finally {
      isCreating = false;
    }
  }

  async function openInfoModal(item: Coupon) {
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
      setOpenDetail(true);
      const res = await getDataAdmin(
        `/api/v1/users/admin/coupons/${item.couponId}`,
        getCookie("accessToken")!
      );
      setCouponDetail(res.result);
    } catch (e) {
      console.error(e);
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-coupon-title"
        aria-describedby="delete-coupon-description"
      >
        <DialogContent>
          <DialogTitle sx={{ textAlign: "center" }} id="delete-coupon-title">
            {`Xác nhận thiết lập lại trạng thái coupon này?`}
          </DialogTitle>
          <DialogContentText id="delete-coupon-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={(e) => handleUpdateCoupon(e, coupon)} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Tạo coupon mới
          </h2>
          <form
            onSubmit={(event) => handleCreateCoupon(event)}
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="couponId">
                  Mã coupon
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="off"
                  fullWidth
                  name="couponId"
                  id="couponId"
                  value={createCoupon.couponId}
                  onChange={handleCoupon}
                  label="Mã coupon"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel htmlFor="bannerId">Mã banner</InputLabel>
                <Select
                  id="bannerId"
                  name="bannerId"
                  value={createCoupon.bannerId}
                  onChange={handleCoupon}
                  input={<OutlinedInput label="Mã banner" />}
                >
                  {banners.map((banner) => (
                    <MenuItem key={banner.bannerId} value={banner.bannerId}>
                      {banner.bannerId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DatePicker
                  value={dayjs(createCoupon.startAt)}
                  onChange={(newValue: any) =>
                    setCreateCoupon({
                      ...createCoupon,
                      startAt: newValue,
                    })
                  }
                  slotProps={{
                    textField: {
                      required: true,
                    },
                  }}
                  className="col-span-full"
                />
              </LocalizationProvider>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en"
              >
                <DatePicker
                  value={dayjs(createCoupon.expireAt)}
                  onChange={(newValue: any) =>
                    setCreateCoupon({
                      ...createCoupon,
                      expireAt: newValue,
                    })
                  }
                  slotProps={{
                    textField: {
                      required: true,
                    },
                  }}
                  className="col-span-full"
                />
              </LocalizationProvider>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl
                className="col-span-full"
                error={discountError !== ""}
              >
                <InputLabel className="mb-2" htmlFor="discount">
                  Phần trăm giảm giá
                </InputLabel>
                <OutlinedInput
                  type="number"
                  required
                  autoComplete="off"
                  fullWidth
                  name="discount"
                  id="discount"
                  value={createCoupon.discount}
                  onChange={handleCoupon}
                  label="Phần trăm giảm giá"
                />
                <FormHelperText id="discount-error">
                  {discountError}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Category">
                  Danh mục
                </InputLabel>
                <Select
                  required
                  multiple
                  labelId="Category"
                  id="Category"
                  name="categoryName"
                  value={createCoupon.categoryIds}
                  label="Danh mục"
                  onChange={handleCategoriesChange}
                >
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category) => {
                      return (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            <div className="col-span-full">
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                type="submit"
              >
                Tạo
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openDetail}
        onClose={handleCloseDetail}
        aria-labelledby="order-tracking-title"
        aria-describedby="order-tracking-description"
      >
        <Box className="" sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center p-2">
            Chi tiết coupon
          </h2>
          {couponDetail ? (
            <>
              <div className="py-2 text-text-light-color">
                Mã coupon: {couponDetail?.couponId}
              </div>
              <div className="py-2 text-text-light-color">
                Danh mục được giảm giá: {couponDetail?.categoryNames.join(", ")}
              </div>
              <div className="py-2 text-text-light-color">
                Mã banner áp dụng: {couponDetail?.bannerId}
              </div>
              <div className="py-2 text-text-light-color">
                Thời gian bắt đầu hiệu lực:{" "}
                {dayjs(couponDetail?.starAt).format("DD/MM/YYYY")}
              </div>
              <div className="py-2 text-text-light-color">
                Thời gian hết hạn:{" "}
                {dayjs(couponDetail?.expireAt).format("DD/MM/YYYY")}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center p-4 h-[14rem]">
              <CircularProgress />
            </div>
          )}
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* coupons */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <Title>
              <div className="flex w-full justify-between items-center min-w-[680px]">
                <span>Danh sách coupon</span>
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  Tạo mới
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã coupon</TableCell>
                  <TableCell>Thời gian bắt đầu hiệu lực</TableCell>
                  <TableCell>Thời gian hết hạn</TableCell>
                  <TableCell>Phần trăm giảm giá</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couponList &&
                  couponList.length > 0 &&
                  couponList.map((item) => (
                    <TableRow key={item.couponId}>
                      <TableCell>
                        <span className="text-center">{item.couponId}</span>
                      </TableCell>
                      <TableCell>
                        {dayjs(new Date(item.startAt!)).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(new Date(item.expireAt!)).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{item.discount * 100}%</TableCell>
                      <TableCell>
                        {item.checkCoupon
                          ? "Đang triển khai"
                          : "Chưa triển khai"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-x-2 items-center">
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
                                backgroundColor: "transparent",
                                opacity: "0.6",
                              },
                              color: "#639df1",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.checkCoupon ? "Thu hồi" : "Triển khai"}
                          </Button>
                          <Button></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={coupons.length}
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

export default AdminCoupon;
