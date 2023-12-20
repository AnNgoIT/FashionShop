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
import { modalStyle } from "@/features/img-loading";
import { Style, StyleValue } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { createData, patchData } from "@/hooks/useAdmin";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { decodeToken } from "@/features/jwt-decode";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";

type AdminStyleValueProps = {
  styleValues: StyleValue[];
  styles: Style[];
  token?: { accessToken?: string; refreshToken?: string };
};
type UpdateStyleValue = {
  name: string | null;
};

const AdminStyleValue = (props: AdminStyleValueProps) => {
  const { styleValues, styles, token } = props;
  const router = useRouter();
  const [styleValue, setStyleValue] = useState<StyleValue>({
    styleValueId: 0,
    name: "",
    styleName: "",
    isActive: false,
  });

  const [isUpdate, setUpdate] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [styleValueList, setstyleValueList] = useState<StyleValue[]>(
    styleValues
      .sort((a, b) => b.styleValueId - a.styleValueId)
      .slice(0, rowsPerPage)
  );

  useEffect(() => {
    styleValues &&
      setstyleValueList(
        styleValues
          .sort((a, b) => b.styleValueId - a.styleValueId)
          .slice(0, rowsPerPage)
      );
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
  }, [styleValues, rowsPerPage, token]);

  function resetStyleValue() {
    setStyleValue({
      styleValueId: 0,
      name: "",
      styleName: "",
      isActive: false,
    });
    setPage(0);
    setRowsPerPage(5);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetStyleValue();
    setUpdate(false);
    setOpen(false);
  };

  const handleStyleValue = (e: any) => {
    const value = e.target.value;
    setStyleValue({
      ...styleValue,
      [e.target.name]: value,
    });
  };

  const openUpdateModal = (styleValue: StyleValue) => {
    // const category = categoryList.find((category) => category.styleId == id);
    setUpdateId(styleValue.styleValueId);
    setStyleValue(styleValue);
    setUpdate(true);
    handleOpen();
    // setName(category?.name!);
    // setImage(category?.image!);
    // setUpdatedAt(category?.updatedAt!);
    // setUpdate(true);
    // handleOpen();
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newstyleList = styleValues.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setstyleValueList(newstyleList);
  };

  const handleSearchstyleValues = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setstyleValueList(styleValues.slice(0, rowsPerPage));
    else {
      const newstyleList = styleValues.filter((item) =>
        item.name.includes(name)
      );
      setstyleValueList(newstyleList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setstyleValueList(styleValues.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  async function handleUpdateStyleValue(
    event: React.FormEvent<HTMLFormElement>
  ) {
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

    const updatePayload: UpdateStyleValue = {
      name: styleValue ? styleValue.name : null,
    };
    const update = await patchData(
      `/api/v1/users/admin/styleValues/${updateId}`,
      getCookie("accessToken")!,
      updatePayload
    );
    if (update.success) {
      successMessage("Đổi giá trị thành công");
      // setOrderList((prevOrderItems) =>
      //   prevOrderItems.map((item) =>
      //     item.orderId === order.orderId ? { ...item, status: newStatus } : item
      //   )
      // );
      router.refresh();
      resetStyleValue();
      setUpdateId(-1);
      handleClose();
    } else if (update.statusCode == 401) {
      warningMessage("Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới");
      router.refresh();
    } else if (update.status == 500) {
      errorMessage("Lỗi hệ thống");
      resetStyleValue();
      setUpdateId(-1);
      handleClose();
      router.refresh();
    } else if (update.status == 404) {
      errorMessage("Không tìm thấy giá trị này");
      router.refresh();
    } else errorMessage("Tên giá trị mới phải khác với các tên giá trị cũ");
  }
  async function handleCreateStyleValue(e: { preventDefault: () => void }) {
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
    const payload = {
      name: styleValue.name,
      styleId: styleValue.styleName,
    };
    const id = toast.loading("Đang tạo...");
    const res = await createData(
      "/api/v1/users/admin/styleValues",
      getCookie("accessToken")!,
      payload,
      "application/json"
    );
    if (res.success) {
      toast.update(id, {
        render: `Tạo giá trị kiểu thành công`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      handleClose();
      router.refresh();
    } else if (res.statusCode == 403 || res.statusCode == 401) {
      toast.update(id, {
        render: `Phiên đăng nhập hết hạn, đang tạo phiên mới`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
      router.refresh();
    } else if (res.statusCode == 409) {
      toast.update(id, {
        render: "Giá trị này đã tồn tại",
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
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            {isUpdate ? `Cập nhật giá trị mới` : "Tạo mới"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateStyleValue(event)
                : (event) => handleCreateStyleValue(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Tên
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="off"
                  fullWidth
                  name="name"
                  id="Name"
                  value={styleValue.name}
                  onChange={handleStyleValue}
                  label="Tên"
                />
              </FormControl>
            </div>
            {!isUpdate && (
              <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                <FormControl className="col-span-full">
                  <InputLabel className="mb-2" htmlFor="styleId">
                    Kiểu
                  </InputLabel>
                  <Select
                    required
                    labelId="styleId"
                    id="style-id"
                    name="styleName"
                    value={styleValue.styleName}
                    label="Kiểu"
                    onChange={handleStyleValue}
                  >
                    {styles &&
                      styles.length > 0 &&
                      styles.map((style) => {
                        return (
                          <MenuItem key={style.styleId} value={style.styleId}>
                            {style.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="col-span-full">
              <button
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                     float-right px-[15px] text-white rounded-[5px]"
                type="submit"
              >
                {isUpdate ? "Lưu" : "Tạo"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* styleValues */}
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
                <span>Danh sách giá trị kiểu</span>
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newStyle) =>
                    handleSearchstyleValues(e, newStyle?.name!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.name == "" ||
                    option.name == value.name
                  }
                  options={styleValues}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Giá trị kiểu" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.styleValueId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <span key={`cate-name-${option.styleValueId}`}>
                          {option.name}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.styleValueId}
                        label={option.styleValueId}
                      />
                    ));
                  }}
                />
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  Tạo mới
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Kiểu</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {styleValueList &&
                  styleValueList.length > 0 &&
                  styleValueList.map((item) => (
                    <TableRow key={item.styleValueId}>
                      <TableCell>
                        {item.styleName == "Size"
                          ? "Kích thước"
                          : item.styleName == "Color"
                          ? "Màu sắc"
                          : "Khác"}
                      </TableCell>
                      <TableCell>
                        <span className="text-center">{item.name}</span>
                      </TableCell>
                      <TableCell sx={{ minWidth: "18rem" }}>
                        <Button
                          onClick={() => openUpdateModal(item)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                              opacity: "0.6",
                            },
                            color: "#639df1",
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={styleValues.length}
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

export default AdminStyleValue;
