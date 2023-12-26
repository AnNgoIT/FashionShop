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
import Image from "next/image";
import { product_1 } from "@/assests/images";
import {
  VisuallyHiddenInput,
  imageLoader,
  modalStyle,
} from "@/features/img-loading";
import { Category, Style } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { createData, patchData, putData } from "@/hooks/useAdmin";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuProps } from "./admin-product";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import {
  successMessage,
  warningMessage,
  errorMessage,
} from "@/features/toasting";
import { decodeToken } from "@/features/jwt-decode";

type AdminCategoryProps = {
  categories: Category[];
  styles: Style[];
  token?: { accessToken?: string; refreshToken?: string };
};

type UpdateCategory = {
  name: string;
  parentId: number | null;
  imageFile: string;
};
const AdminCategory = (props: AdminCategoryProps) => {
  const { categories, styles, token } = props;
  const router = useRouter();
  const [category, setCategory] = useState<Category>({
    categoryId: 0,
    name: "",
    image: "",
    parentName: "",
    styleNames: [],
    isActive: false,
  });

  const [image, setImage] = useState<any>("");
  const [isUpdate, setUpdate] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [updateCategory, setUpdateCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [categoryList, setCategoryList] = useState<Category[]>(
    categories.sort((a, b) => b.categoryId - a.categoryId).slice(0, rowsPerPage)
  );

  useEffect(() => {
    categories &&
      setCategoryList(
        categories
          .sort((a, b) => b.categoryId - a.categoryId)
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
  }, [categories, rowsPerPage, token]);

  function resetCategory() {
    setCategory({
      categoryId: 0,
      name: "",
      image: "",
      styleNames: [],
      isActive: false,
    });
    setImage("");
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetCategory();
    setUpdateCategory(null);
    setUpdate(false);
    setOpen(false);
  };

  function changeStyleNameToId() {
    let result: any = [];
    result = category.styleNames.map((item) => {
      let foundItem = styles.find((element: any) => element.name === item);
      return foundItem ? foundItem.styleId : null;
    });
    return result;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setCategory({ ...category, image: imageUrl });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCategory = (e: any) => {
    const value = e.target.value;
    setCategory({
      ...category,
      [e.target.name]: value,
    });
  };

  const handleStyle = (
    event: SelectChangeEvent<typeof category.styleNames>
  ) => {
    const {
      target: { value },
    } = event;
    setCategory({
      ...category,
      styleNames: typeof value === "string" ? value.split(",") : value,
    });
  };

  const openUpdateModal = (category: Category) => {
    // const category = categoryList.find((category) => category.categoryId == id);\
    setCategory(category);
    setUpdateCategory(category);
    // setName(category?.name!);
    // setImage(category?.image!);
    // setUpdatedAt(category?.updatedAt!);
    setUpdate(true);
    handleOpen();
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newCategoryList = categories.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setCategoryList(newCategoryList);
  };

  const handleSearchCategories = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setCategoryList(categories.slice(0, rowsPerPage));
    else {
      const newCategoryList = categories.filter((item) =>
        item.name.includes(name)
      );
      setCategoryList(newCategoryList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setCategoryList(categories.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  const handleUpdateCategoryParentName = (e: any) => {
    const value = e.target.value;
    setUpdateCategory({
      ...updateCategory!,
      parentName: value,
    });
  };

  let isUpdating = false;
  async function handleUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
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
    const updatePayload: UpdateCategory = {
      name: category?.name,
      parentId:
        categories.find(
          (category) => category.name === updateCategory?.parentName
        )?.categoryId || null,
      imageFile: image,
    };

    const formData = new FormData();
    formData.append("name", updatePayload.name);
    updatePayload.parentId &&
      formData.append("parentId", updatePayload.parentId.toString());
    if (image instanceof File) {
      formData.append("imageFile", updatePayload.imageFile);
    }
    try {
      const update = await patchData(
        `/api/v1/users/admin/categories/${updateCategory?.categoryId}`,
        getCookie("accessToken")!,
        updatePayload,
        "multipart/form-data"
      );
      handleClose();
      if (update.success) {
        successMessage("Đổi danh mục thành công");
        // setOrderList((prevOrderItems) =>
        //   prevOrderItems.map((item) =>
        //     item.orderId === order.orderId ? { ...item, status: newStatus } : item
        //   )
        // );
        router.refresh();
      } else if (update.statusCode == 401) {
        warningMessage(
          "Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới"
        );
        router.refresh();
      } else if (update.status == 500) {
        errorMessage("Lỗi hệ thống");
        router.refresh();
      } else if (update.status == 404) {
        errorMessage("Không tìm thấy danh mục này");
        router.refresh();
      } else
        errorMessage(
          "Tên danh mục và danh mục cha mới phải khác với các tên cũ"
        );
    } catch (e) {
      console.error(e);
    }
  }

  let isCreating = false;
  async function handleCreateCategory(e: { preventDefault: () => void }) {
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

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("parentId", category.parentName!);
    formData.append("imageFile", image);
    formData.append("styleIds", changeStyleNameToId().join(","));
    if (isCreating) return;
    isCreating = true;

    try {
      const id = toast.loading("Đang tạo...");
      const res = await createData(
        "/api/v1/users/admin/categories",
        getCookie("accessToken")!,
        formData
      );
      handleClose();
      if (res.success) {
        toast.update(id, {
          render: `Tạo mới danh mục thành công`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        router.refresh();
      } else if (res.statusCode == 403 || res.statusCode == 401) {
        toast.update(id, {
          render: `Vui lòng đăng nhập`,
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
      } else if (res.statusCode == 409) {
        toast.update(id, {
          render: "Danh mục này đã tồn tại",
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
    } catch (error) {
      console.error(error);
    } finally {
      isCreating = false;
    }
  }

  // async function handleChangeCategoryActive(item: Category) {
  //   console.log(item);
  //   const newActiveStatus = item.isActive ? false : true;
  //   const changeCategoryActive = await patchData(
  //     `/api/v1/users/admin/categories/${item.categoryId}`,
  //     getCookie("accessToken")!,
  //     { isActive: newActiveStatus }
  //   );

  //   if (changeCategoryActive.success) {
  //     successMessage("Đổi trạng thái danh mục thành công");
  //     setCategoryList(
  //       categories
  //         .filter((category) => category.categoryId !== item.categoryId)
  //         .sort((a, b) => b.categoryId - a.categoryId)
  //         .slice(0, rowsPerPage)
  //     );
  //     router.refresh();
  //   } else if (changeCategoryActive.status == 401) {
  //     warningMessage("Phiên đăng nhập của bạn hết hạn, đang đặt lại phiên mới");
  //     router.refresh();
  //   } else if (changeCategoryActive.status == 500) {
  //     errorMessage("Lỗi hệ thống");
  //     router.refresh();
  //   } else if (changeCategoryActive.status == 404) {
  //     errorMessage("Không tìm thấy danh mục này");
  //   } else errorMessage("Lỗi sai dữ liệu truyền");
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
      <Toolbar />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            {isUpdate ? `Cập nhật danh mục` : "Tạo danh mục mới"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateCategory(event)
                : (event) => handleCreateCategory(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Tên
                </InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  fullWidth
                  name="name"
                  id="Name"
                  value={category.name}
                  onChange={handleCategory}
                  // placeholder="Type your Name"
                  label="Tên"
                />
              </FormControl>
            </div>
            {!isUpdate && (
              <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                <FormControl className="col-span-full">
                  <InputLabel className="mb-2" htmlFor="parentName">
                    Tên danh mục cha
                  </InputLabel>
                  <Select
                    labelId="parentName"
                    id="parent-name"
                    name="parentName"
                    defaultValue={category.parentName}
                    label="Tên danh mục cha"
                    onChange={handleCategory}
                  >
                    {categories &&
                      categories.length > 0 &&
                      categories
                        .filter(
                          (category) =>
                            category.parentName == null &&
                            category.categoryId !== undefined
                        )
                        .map((category) => {
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
            )}
            {isUpdate && updateCategory && (
              <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                <FormControl className="col-span-full">
                  <InputLabel className="mb-2" htmlFor="parentName">
                    Tên danh mục cha
                  </InputLabel>
                  <Select
                    labelId="parentName"
                    id="parent-name"
                    name="parentName"
                    value={updateCategory.parentName || ""}
                    label="Tên danh mục cha"
                    onChange={handleUpdateCategoryParentName}
                  >
                    {categories &&
                      categories.length > 0 &&
                      categories
                        .filter((category) => category.parentName == null)
                        .map((category) => {
                          return (
                            <MenuItem
                              key={category.categoryId}
                              value={category.name}
                            >
                              {category.name}
                            </MenuItem>
                          );
                        })}
                  </Select>
                </FormControl>
              </div>
            )}
            {!isUpdate && (
              <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                <FormControl className="col-span-full">
                  <InputLabel className="mb-2" htmlFor="styleIds">
                    Kiểu danh mục
                  </InputLabel>
                  <Select
                    id="category-styleNames"
                    multiple
                    name="styleIds"
                    value={category.styleNames}
                    onChange={handleStyle}
                    input={<OutlinedInput label="Kiểu danh mục" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {styles.map((style) => (
                      <MenuItem key={style.styleId} value={style.name}>
                        <Checkbox
                          checked={category.styleNames.indexOf(style.name) > -1}
                        />
                        <ListItemText primary={style.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="col-span-full grid text-sm text-[#999] font-medium mb-4  place-items-center">
              {category && category.image ? (
                <Image
                  loader={imageLoader}
                  className="w-[6.25rem] h-[6.25rem] rounded-md"
                  width={300}
                  height={300}
                  src={category.image}
                  alt="Uploaded Image"
                ></Image>
              ) : (
                <p className="grid place-content-center text-xl text-text-color">
                  Không có ảnh nào
                </p>
              )}
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Tải ảnh lên
                <VisuallyHiddenInput
                  required={!isUpdate}
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
                {isUpdate ? "Lưu" : "Tạo"}
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
              <div className="flex w-full justify-between items-center min-w-[680px]">
                <span>Danh sách danh mục sản phẩm</span>
                <Autocomplete
                  sx={{ width: 300 }}
                  onChange={(e, newCatory) =>
                    handleSearchCategories(e, newCatory?.name!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.name == "" ||
                    option.name == value.name
                  }
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Danh mục sản phẩm" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.categoryId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <Image
                          loader={imageLoader}
                          placeholder="blur"
                          blurDataURL={option.image}
                          key={`cate-img-${option.categoryId}`}
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={option.image == "" ? product_1 : option.image}
                        ></Image>
                        <span key={`cate-name-${option.categoryId}`}>
                          {option.name}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.categoryId}
                        label={option.categoryId}
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
                  <TableCell>Tên</TableCell>
                  <TableCell>Danh mục cha</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryList &&
                  categoryList.map((item) => (
                    <TableRow key={item.categoryId}>
                      <TableCell>
                        <span className="text-center">{item.name}</span>
                      </TableCell>
                      <TableCell>{item.parentName || "Không có"}</TableCell>
                      <TableCell>
                        <Image
                          loader={imageLoader}
                          className="w-[4rem] h-[4rem] outline outline-1 outline-border-color p-1"
                          width={80}
                          height={80}
                          alt="productImg"
                          src={item.image == "" ? product_1 : item.image}
                          priority
                        ></Image>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-x-2">
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
                          {/* <Button
                            onClick={() => handleChangeCategoryActive(item)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "transparent",
                                opacity: "0.6",
                              },
                              color: "#639df1",
                            }}
                          >
                            {item.isActive && "Ẩn hoạt động"}
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={categories.length}
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

export default AdminCategory;
