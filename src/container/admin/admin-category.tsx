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
import { createData } from "@/hooks/useAdmin";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuProps } from "./admin-product";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getUniqueObjects } from "@/features/product";
import { CldImage } from "next-cloudinary";

type AdminCategoryProps = {
  categories: Category[];
  styles: Style[];
};
const AdminCategory = (props: AdminCategoryProps) => {
  const { categories, styles } = props;
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
  const [updateId, setUpdateId] = useState<number>(-1);
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
  }, [categories, rowsPerPage]);

  function resetCategory() {
    setCategory({
      categoryId: 0,
      name: "",
      image: "",
      styleNames: [],
      isActive: false,
    });
    setPage(0);
    setRowsPerPage(5);
    setImage("");
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetCategory();
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

  const openUpdateModal = (id: number) => {
    // const category = categoryList.find((category) => category.categoryId == id);
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

  // function handleUpdateCategory(
  //   event: React.FormEvent<HTMLFormElement>,
  //   id: number
  // ) {
  //   event.preventDefault();
  //   const newCategoryList = categoryList.map((item: Category) => {
  //     if (item.categoryId == id) {
  //       item = {
  //         categoryId: id,
  //         name,
  //         parentName: undefined,
  //         image,
  //         createdAt,
  //         updatedAt,
  //         isActive: true,
  //         styleNames: [],
  //       };
  //     }
  //     return item;
  //   });
  //   setCategoryList(newCategoryList);

  //   resetCategory();
  //   setUpdateId(-1);
  //   handleClose();
  // }
  async function handleCreateCategory(e: { preventDefault: () => void }) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("parentId", category.parentName!);
    formData.append("imageFile", image);
    formData.append("styleIds", changeStyleNameToId().join(","));

    const id = toast.loading("Creating...");
    const res = await createData(
      "/api/v1/users/admin/categories",
      getCookie("accessToken")!,
      formData
    );
    if (res.success) {
      toast.update(id, {
        render: `Created Category Success`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      handleClose();
      router.refresh();
    } else if (res.statusCode == 403 || res.statusCode == 401) {
      toast.update(id, {
        render: `You don't have permission`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else if (res.statusCode == 409) {
      toast.update(id, {
        render: "Category already existed",
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else {
      toast.update(id, {
        render: "Server Error",
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
            {isUpdate ? `Category ID: ${updateId}` : "Create Category"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => {} //handleUpdateCategory(event, updateId)
                : (event) => handleCreateCategory(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Name
                </InputLabel>
                <OutlinedInput
                  autoComplete="off"
                  fullWidth
                  name="name"
                  id="Name"
                  value={category.name}
                  onChange={handleCategory}
                  // placeholder="Type your Name"
                  label="Name"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="parentName">
                  Parent Category
                </InputLabel>
                <Select
                  labelId="parentName"
                  id="parent-name"
                  name="parentName"
                  value={category.parentName}
                  label="Parent Category"
                  onChange={handleCategory}
                >
                  {categories &&
                    categories.length > 0 &&
                    categories
                      .filter((category) => category.parentName == null)
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
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="styleIds">
                  Category Style
                </InputLabel>
                <Select
                  id="category-styleNames"
                  multiple
                  name="styleIds"
                  value={category.styleNames}
                  onChange={handleStyle}
                  input={<OutlinedInput label="Category Style" />}
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

            <div className="col-span-full grid text-sm text-[#999] font-medium mb-4">
              {category && category.image ? (
                <Image
                  loader={imageLoader}
                  className="w-[6.25rem] h-[6.25rem] rounded-md"
                  width={300}
                  height={300}
                  src={category.image}
                  alt="Uploaded Image"
                  priority
                ></Image>
              ) : (
                <p className="grid place-content-center text-xl text-text-color">
                  No Image
                </p>
              )}
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Upload file
                <VisuallyHiddenInput
                  required
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
                {isUpdate ? "Save" : "Create"}
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
                <span>Category List</span>
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
                    <TextField {...params} label="Categories" />
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
                          key={`cate-img-${option.categoryId}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={option.image == "" ? product_1 : option.image}
                          priority
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
                  New Category
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell>Image</TableCell>
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
                      <TableCell>{item.parentName || "None"}</TableCell>
                      <TableCell>
                        <Image
                          loader={imageLoader}
                          // placeholder="blur"
                          className="w-[5rem] h-[5rem] outline outline-1 outline-border-color"
                          width={80}
                          height={80}
                          alt="productImg"
                          src={item.image == "" ? product_1 : item.image}
                          priority
                        ></Image>
                      </TableCell>
                      <TableCell sx={{ minWidth: "18rem" }}>
                        <Button
                          onClick={() => openUpdateModal(item.categoryId)}
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
