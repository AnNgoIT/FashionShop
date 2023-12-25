"use client";
import {
  VisuallyHiddenInput,
  imageLoader,
  modalOrderDetailStyle,
} from "@/features/img-loading";
import Title from "@/components/dashboard/Title";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Account, User } from "@/features/types";
import { user_img2 } from "@/assests/users";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { decodeToken } from "@/features/jwt-decode";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { createData } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import {
  successMessage,
  warningMessage,
  errorMessage,
} from "@/features/toasting";
import { provinces as provincesData } from "@/store/provinces";
import { validateCreateAccountForm } from "@/features/validation";
import FormHelperText from "@mui/material/FormHelperText";
import MuiPhoneNumber from "mui-phone-number";
import InputAdornment from "@mui/material/InputAdornment";
import ShowHidePassword from "@/features/visibility";

const AdminShipper = ({
  shippers,
  token,
}: {
  shippers: User[];
  token?: { accessToken?: string; refreshToken?: string };
}) => {
  const router = useRouter();
  const result: any[] = provincesData;

  const [shipper, setShipper] = useState<Account>({
    fullname: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Account>({
    fullname: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState<User[]>(
    shippers.slice(0, rowsPerPage)
  );

  const provinceList: string[] =
    result && result.map((item: any) => (item = item.name));

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetUser();
    setOpen(false);
  };

  const handleShipper = (event: any) => {
    const value = event.target.value;
    setShipper({
      ...shipper,
      [event.target.name]: value,
    });
    setErrors({
      ...errors,
      [event.target.name]: "",
    });
  };

  const handlePhone = (value: any) => {
    setShipper({
      ...shipper,
      phone: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      ...errors,
      phone: "",
    });
  };

  useEffect(() => {
    shippers &&
      shippers.length > 0 &&
      setUserList(shippers.slice(0, rowsPerPage));
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
  }, [shippers, rowsPerPage, token]);

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newUserList = shippers.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setUserList(newUserList);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setUserList(shippers.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  async function handleCreateUser(e: { preventDefault: () => void }) {
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

    const newAccount: Account = {
      fullname: shipper.fullname,
      email: shipper.email,
      address: shipper.address,
      phone: shipper.phone,
      password: shipper.password,
      confirmPassword: shipper.confirmPassword,
    };

    const formErrors = validateCreateAccountForm(newAccount);
    if (isError(formErrors)) {
      const res = await createData(
        "/api/v1/users/admin/user-management/shippers",
        getCookie("accessToken")!,
        newAccount,
        "application/json"
      );
      resetUser();
      handleClose();
      if (res.success) {
        successMessage("Tạo người vận chuyển mới thành công");
        router.refresh();
      } else if (res.statusCode == 401) {
        warningMessage(
          "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
        );
        resetUser();
        handleClose();
        router.refresh();
      } else if (res.status == 500) {
        errorMessage("Lỗi hệ thống");
        resetUser();
        handleClose();
        router.refresh();
      } else if (res.statusCode == 400) {
        errorMessage("Tài khoản này đã tồn tại");
        router.refresh();
      }
    } else setErrors(formErrors);
  }

  const handleSearchshippers = (
    e: { preventDefault: () => void },
    email: string
  ) => {
    e.preventDefault();
    if (email == undefined) setUserList(shippers.slice(0, rowsPerPage));
    else {
      const newUserList = shippers.filter((item) => item.email.includes(email));
      setUserList(newUserList);
    }
  };
  function resetUser() {
    setShipper({
      fullname: "",
      address: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({
      fullname: "",
      address: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
  }

  const isError = (error: Account) => {
    for (const key in error) {
      if (error[key as keyof Account] !== "") {
        return false; // Nếu có ít nhất một giá trị trống, trả về true
      }
    }
    return true; // Nếu tất cả giá trị đều không trống, trả về false
  };

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
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Tạo người giao hàng mới
          </h2>
          <form
            onSubmit={(event) => handleCreateUser(event)}
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl
                className="col-span-full"
                error={errors.fullname != ""}
              >
                <InputLabel className="mb-2" htmlFor="Full Name">
                  Tên
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Full Name"
                  name="fullname"
                  value={shipper.fullname}
                  onChange={handleShipper}
                  // placeholder="Type your Full Name"
                  label="Tên"
                />
                <FormHelperText id="fullname-error">
                  {errors.fullname}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full" error={errors.email != ""}>
                <InputLabel className="mb-2" htmlFor="Email">
                  Email
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Email"
                  name="email"
                  value={shipper.email}
                  onChange={handleShipper}
                  // placeholder="Type your Email"
                  label="Email"
                />
                <FormHelperText id="email-error">{errors.email}</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full" error={errors.phone != ""}>
                <MuiPhoneNumber
                  inputProps={{ maxLength: 10 }}
                  // value={account.phone}
                  disableAreaCodes={true}
                  disableCountryCode={true}
                  defaultCountry={"vn"}
                  onChange={handlePhone}
                />
                <FormHelperText id="phone-error">{errors.phone}</FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl
                className="col-span-full"
                error={errors.address != ""}
              >
                <Autocomplete
                  sx={{
                    width: "100%",
                  }}
                  isOptionEqualToValue={(option, value) =>
                    value == undefined || value == "" || option === value
                  }
                  value={shipper.address || ""}
                  onChange={(_event, newProvinces) => {
                    setShipper({ ...shipper, address: newProvinces || "" });
                  }}
                  options={provinceList}
                  renderInput={(params) => (
                    <TextField {...params} label="Địa chỉ" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option}>
                        {option}
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                      />
                    ));
                  }}
                />
                <FormHelperText id="address-error">
                  {errors.address}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl
                className="col-span-full"
                error={errors.password != ""}
              >
                <InputLabel className="mb-2" htmlFor="Password">
                  Mật khẩu
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  autoComplete="true"
                  fullWidth
                  id="Password"
                  name="password"
                  value={shipper.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <ShowHidePassword
                        showPassword={showPassword}
                        click={handleClickShowPassword}
                        mousedownPassword={handleMouseDownPassword}
                      />
                    </InputAdornment>
                  }
                  onChange={handleShipper}
                  // placeholder="Type your Password"
                  label="Mật khẩu"
                />
                <FormHelperText id="password-error">
                  {errors.password}
                </FormHelperText>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl
                className="col-span-full"
                error={errors.confirmPassword != ""}
              >
                <InputLabel className="mb-2" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  autoComplete="true"
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  value={shipper.confirmPassword}
                  onChange={handleShipper}
                  // placeholder="Type your Password"
                  label="Xác nhận Mật khẩu"
                />
                <FormHelperText id="confirmPassword-error">
                  {errors.confirmPassword}
                </FormHelperText>
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Categories */}
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
              <div className="grid grid-flow-col items-center justify-between min-w-[768px]">
                <span className="">Danh sách người giao hàng</span>
                {/* <Autocomplete
                  sx={{
                    minWidth: 350,
                  }}
                  onChange={(e, newUser) =>
                    handleSearchshippers(e, newUser?.email!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.email == "" ||
                    option.email == value.email
                  }
                  options={shippers}
                  getOptionLabel={(option) => option.email!}
                  renderInput={(params) => (
                    <TextField {...params} label="Người giao hàng" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.userId}
                        className="flex justify-between items-center px-3 py-2 border-b border-border-color"
                      >
                        <Image
                          // loader={imageLoader}
                          key={`product-img-${option.userId}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={
                            option.avatar == "" || option.avatar == null
                              ? user_img2.src
                              : option.avatar
                          }
                          priority
                        ></Image>

                        <span
                          className="max-w-[1rem]"
                          key={`product-name-${option.userId}`}
                        >
                          {option.email}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.userId}
                        label={option.userId}
                      />
                    ));
                  }}
                /> */}
                <div className="w-max">
                  <NavigateButton onClick={handleOpen}>
                    <AddIcon sx={{ marginRight: "0.25rem" }} />
                    Tạo mới
                  </NavigateButton>
                </div>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tên</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Điện thoại</TableCell>
                  <TableCell align="left">Khu vực giao hàng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList &&
                  userList.length > 0 &&
                  userList.map((item) => (
                    <TableRow key={item.userId}>
                      <TableCell sx={{ minWidth: "max-content" }} align="left">
                        {item.fullname}
                      </TableCell>

                      <TableCell align="left">{item.email}</TableCell>
                      <TableCell align="left">
                        {item?.phone?.length == 13
                          ? item.phone.slice(3, 13)
                          : item.phone}
                      </TableCell>
                      <TableCell align="left">{item.address}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={shippers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminShipper;
