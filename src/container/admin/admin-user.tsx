"use client";
import { imageLoader } from "@/features/img-loading";
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
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User } from "@/features/types";
import { user_img2 } from "@/assests/users";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { decodeToken } from "@/features/jwt-decode";
import { deleteCookie, setCookie } from "cookies-next";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";

const AdminUser = ({
  users,
  token,
}: {
  users: User[];
  token?: { accessToken?: string; refreshToken?: string };
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<string>("CUSTOMER");
  const [avatar, setAvatar] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [eWallet, setEWallet] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState<User[]>(users.slice(0, rowsPerPage));

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetUser();
    setOpen(false);
  };

  useEffect(() => {
    users && users.length > 0 && setUserList(users.slice(0, rowsPerPage));
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
  }, [users, rowsPerPage, token]);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;

  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       if (e.target && e.target.result) {
  //         const imageUrl = e.target.result.toString();
  //         setAvatar(imageUrl);
  //       }
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleCustomButtonClick = () => {
  //   if (fileInputRef && fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newUserList = users.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setUserList(newUserList);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setUserList(users.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  function generateUUID(): `${string}-${string}-${string}-${string}-${string}` {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    ) as `${string}-${string}-${string}-${string}-${string}`;
  }

  // function handleCreateUser(e: { preventDefault: () => void }) {
  //   e.preventDefault();
  //   const newId = generateUUID();
  //   const result: User = {
  //     userId: newId,
  //     fullname,
  //     email,
  //     phone,
  //     isVerified: false,
  //     role,
  //     password,
  //     avatar,
  //     ewallet: 0,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     dob: null,
  //     gender: null,
  //     address: null,
  //     isActive: false,
  //   };
  //   const newUserList: User[] = [...userList, result];
  //   setUserList(newUserList);
  //   resetUser();
  //   handleClose();
  // }

  const handleSearchUsers = (
    e: { preventDefault: () => void },
    email: string
  ) => {
    e.preventDefault();
    if (email == undefined) setUserList(users.slice(0, rowsPerPage));
    else {
      const newUserList = users.filter((item) => item.email.includes(email));
      setUserList(newUserList);
    }
  };
  function resetUser() {
    setEmail("");
    setPhone("");
    setRole("CUSTOMER");
    setAvatar("");
    setPassword("");
    setEWallet("");
    setFullName("");
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
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalOrderDetailStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-left pb-4">
            Tạo mới người dùng
          </h2>
          <form
            onSubmit={(event) => handleCreateUser(event)}
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Full Name">
                  Full Name
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Full Name"
                  value={fullname}
                  onChange={(event) => setFullName(event.target.value)}
                  // placeholder="Type your Full Name"
                  label="Full Name"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Email">
                  Email
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  required
                  fullWidth
                  id="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  // placeholder="Type your Email"
                  label="Email"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Phone">
                  Phone
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Phone"
                  value={phone}
                  onKeyDown={(e) => onlyNumbers(e)}
                  onChange={(event) => setPhone(event.target.value)}
                  // placeholder="Type your Phone"
                  label="Phone"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value={"CUSTOMER"}>CUSTOMER</MenuItem>
                  <MenuItem value={"SHIPPER"}>SHIPPER</MenuItem>
                  <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Password">
                  Password
                </InputLabel>
                <OutlinedInput
                  type="password"
                  autoComplete="true"
                  required
                  fullWidth
                  id="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  // placeholder="Type your Password"
                  label="Password"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Bank Card Number">
                  Bank Card Number
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Bank Card Number"
                  value={eWallet}
                  onKeyDown={(e) => onlyNumbers(e)}
                  onChange={(event) => setEWallet(event.target.value)}
                  // placeholder="Type your Bank Card Number"
                  label="Bank Card Number"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium mb-4">
              {avatar && (
                <Image
                  onClick={() => {
                    handleCustomButtonClick();
                  }}
                  className="w-[6.25rem] h-[6.25rem] rounded-md"
                  width={300}
                  height={300}
                  src={avatar}
                  alt="Uploaded Image"
                ></Image>
              )}
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Tải ảnh lên
                <VisuallyHiddenInput
                  onChange={(e) => handleImageUpload(e)}
                  type="file"
                />
              </Button>
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
      </Modal> */}
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
              <div className="grid grid-flow-col items-center min-w-[768px]">
                <span className="">Danh sách người dùng</span>
                <Autocomplete
                  sx={{
                    minWidth: 350,
                    justifySelf: "start",
                    marginRight: "8rem",
                    display: "flex",
                  }}
                  onChange={(e, newUser) =>
                    handleSearchUsers(e, newUser?.email!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.email == "" ||
                    option.email == value.email
                  }
                  options={users}
                  getOptionLabel={(option) => option.email!}
                  renderInput={(params) => (
                    <TextField {...params} label="Người dùng" />
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
                />
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tên</TableCell>
                  <TableCell align="left">Ảnh đại diện</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Điện thoại</TableCell>
                  <TableCell align="left">Ngày sinh</TableCell>
                  <TableCell align="left">Thời gian tạo tài khoản</TableCell>
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
                      <TableCell align="left">
                        {
                          <Avatar
                            // placeholder="blur"
                            // blurDataURL={item.avatar}
                            alt="avatar-img"
                            src={item.avatar!}
                          ></Avatar>
                        }
                      </TableCell>
                      <TableCell align="left">{item.email}</TableCell>
                      <TableCell align="left">
                        {item?.phone?.length == 13
                          ? item.phone.slice(3, 13)
                          : !item.phone
                          ? "Không có"
                          : item.phone}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(new Date(item.dob!)).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {dayjs(new Date(item.createdAt!)).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={users.length}
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

export default AdminUser;
