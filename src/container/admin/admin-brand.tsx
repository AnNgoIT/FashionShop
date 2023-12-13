"use client";
import Title from "@/components/dashboard/Title";
import UpdateIcon from "@mui/icons-material/Update";
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
import { Brand } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { createData, patchData } from "@/hooks/useAdmin";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { decodeToken } from "@/features/jwt-decode";
import {
  successMessage,
  warningMessage,
  errorMessage,
} from "@/features/toasting";

type AdminBrandProps = {
  brands: Brand[];
  token?: { accessToken?: string; refreshToken?: string };
};
type UpdateBrand = {
  name: string | null;
  nation: string | null;
};

const AdminBrand = (props: AdminBrandProps) => {
  const { brands, token } = props;
  const router = useRouter();
  const [brand, setBrand] = useState<Brand>({
    brandId: 0,
    name: "",
    nation: "",
    isActive: false,
  });

  const [isUpdate, setUpdate] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [updateBrand, setUpdateBrand] = useState<Brand | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [brandList, setBrandList] = useState<Brand[]>(
    brands.sort((a, b) => b.brandId - a.brandId).slice(0, rowsPerPage)
  );

  useEffect(() => {
    brands &&
      setBrandList(
        brands.sort((a, b) => b.brandId - a.brandId).slice(0, rowsPerPage)
      );
    if (token) {
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
  }, [brands, rowsPerPage, token]);

  function resetBrand() {
    setBrand({
      brandId: 0,
      name: "",
      nation: "",
      isActive: false,
    });
    setPage(0);
    setRowsPerPage(5);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetBrand();
    setUpdate(false);
    setOpen(false);
  };

  const handleBrand = (e: any) => {
    const value = e.target.value;
    setBrand({
      ...brand,
      [e.target.name]: value,
    });
  };

  const openUpdateModal = (brand: Brand) => {
    setUpdateBrand(brand);
    setBrand(brand);
    setUpdate(true);
    handleOpen();
    // const category = categoryList.find((category) => category.brandId == id);
    // setUpdateId(id);
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
    const newBrandList = brands.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setBrandList(newBrandList);
  };

  const handleSearchBrands = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setBrandList(brands.slice(0, rowsPerPage));
    else {
      const newBrandList = brands.filter((item) => item.name.includes(name));
      setBrandList(newBrandList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setBrandList(brands.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  async function handleUpdateBrand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatePayload: UpdateBrand = {
      name: updateBrand ? brand.name : null,
      nation: updateBrand ? brand.nation : null,
    };
    const update = await patchData(
      `/api/v1/users/admin/brands/${updateBrand?.brandId}`,
      getCookie("accessToken")!,
      updatePayload
    );
    if (update.success) {
      successMessage("Đổi thương hiệu thành công");
      // setOrderList((prevOrderItems) =>
      //   prevOrderItems.map((item) =>
      //     item.orderId === order.orderId ? { ...item, status: newStatus } : item
      //   )
      // );
      router.refresh();
      resetBrand();
      setUpdateBrand(null);
      handleClose();
    } else if (update.statusCode == 401) {
      warningMessage("Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới");
      router.refresh();
    } else if (update.status == 500) {
      errorMessage("Lỗi hệ thống");
      resetBrand();
      setUpdateBrand(null);
      handleClose();
      router.refresh();
    } else if (update.status == 404) {
      errorMessage("Không tìm thấy thương hiệu này");
      router.refresh();
    } else
      errorMessage(
        "Tên thương hiệu và quốc gia mới phải khác với các tên thương hiệu và quốc gia cũ"
      );
  }
  async function handleCreateBrand(e: { preventDefault: () => void }) {
    e.preventDefault();

    const payload = {
      name: brand.name,
      nation: brand.nation,
    };
    const id = toast.loading("Đang tạo...");
    const res = await createData(
      "/api/v1/users/admin/brands",
      getCookie("accessToken")!,
      payload,
      "application/json"
    );
    if (res.success) {
      toast.update(id, {
        render: `Tạo thương hiệu mới thành công`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      handleClose();
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
        render: "Thương hiệu này đã tồn tại",
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
            {isUpdate ? `Cập nhật thương hiệu` : "Tạo thương hiệu mới"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateBrand(event)
                : (event) => handleCreateBrand(event)
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
                  value={brand.name}
                  onChange={handleBrand}
                  label="Tên"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="nation">
                  Quốc gia
                </InputLabel>
                <Select
                  required
                  id="nation"
                  name="nation"
                  value={brand.nation}
                  onChange={handleBrand}
                  input={<OutlinedInput label="Quốc gia" />}
                >
                  {["VIETNAM", "CHINA", "USA", "JAPAN", "THAILAND"].map(
                    (nation: string, index: number) => (
                      <MenuItem key={index} value={nation}>
                        <ListItemText primary={nation} />
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
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
        {/* Brands */}
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
                <span>Danh sách thương hiệu</span>
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newBrand) =>
                    handleSearchBrands(e, newBrand?.name!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.name == "" ||
                    option.name == value.name
                  }
                  options={brands}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Thương hiệu" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.brandId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <span key={`brand-name-${option.brandId}`}>
                          {option.name}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.brandId}
                        label={option.brandId}
                      />
                    ));
                  }}
                />
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  Tạo thương hiệu mới
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Quốc gia</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brandList &&
                  brandList.length > 0 &&
                  brandList.map((item) => (
                    <TableRow key={item.brandId}>
                      <TableCell>
                        <span className="text-center">{item.name}</span>
                      </TableCell>
                      <TableCell>{item.nation || "Không xác định"}</TableCell>
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
                          <UpdateIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={brands.length}
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

export default AdminBrand;
