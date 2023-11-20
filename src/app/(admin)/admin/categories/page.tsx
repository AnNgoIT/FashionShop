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
import React, { useRef, useState } from "react";
import Image from "next/image";
import { product_1 } from "@/assests/images";
import {
  VisuallyHiddenInput,
  imageLoader,
  modalStyle,
} from "@/features/img-loading";
import { Category } from "@/features/types";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

const AdminCategoryPage = () => {
  const [name, setName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date());
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const cateList: Category[] = [];

  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);

  const [categoryList, setCategoryList] = useState<Category[]>(
    cateList.slice(0, rowsPerPage)
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetCategory();
    setUpdate(false);
    setOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setImage(imageUrl);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCustomButtonClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openUpdateModal = (id: number) => {
    const category = categoryList.find((category) => category.id == id);
    setUpdateId(id);
    setName(category?.name!);
    setImage(category?.image!);
    setUpdatedAt(category?.updatedAt!);
    setUpdate(true);
    handleOpen();
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newCategoryList = cateList.slice(
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
    setPage(0);
    if (name == undefined) setCategoryList(cateList.slice(0, rowsPerPage));
    else {
      const newCategoryList = cateList.filter((item) =>
        item.name.includes(name)
      );
      setCategoryList(newCategoryList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setCategoryList(cateList.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  function resetCategory() {
    setName("");
    setImage("");
    setUpdatedAt(new Date());
  }

  function handleCreateCategory(e: { preventDefault: () => void }) {
    e.preventDefault();
    const newId = categoryList[categoryList.length - 1].id!;
    const result: Category = {
      id: newId + 1,
      name,
      image,
      createdAt,
      updatedAt,
      length: 0,
      categoryId: 0,
      isActive: false,
    };
    const newCategoryList: Category[] = [...categoryList, result];
    setCategoryList(newCategoryList);
    resetCategory();
    handleClose();
  }

  function handleUpdateCategory(
    event: React.FormEvent<HTMLFormElement>,
    id: number
  ) {
    event.preventDefault();
    const newCategoryList = categoryList.map((item: Category) => {
      if (item.id == id) {
        item = {
          id,
          categoryId: 1,
          name,
          image,
          length,
          createdAt,
          updatedAt,
          isActive: true,
        };
      }
      return item;
    });
    setCategoryList(newCategoryList);

    resetCategory();
    setUpdateId(-1);
    handleClose();
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
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-left pb-4">
            {isUpdate ? `Category ID: ${updateId}` : "Create New Category"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateCategory(event, updateId)
                : (event) => handleCreateCategory(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Category Name">
                  Category Name
                </InputLabel>
                <OutlinedInput
                  autoComplete="true"
                  fullWidth
                  id="Category Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  // placeholder="Type your Category Name"
                  label="Category Name"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid text-sm text-[#999] font-medium mb-4">
              {image && (
                <Image
                  onClick={() => {
                    handleCustomButtonClick();
                  }}
                  className="w-[6.25rem] h-[6.25rem] rounded-md"
                  width={300}
                  height={300}
                  src={image}
                  alt="Uploaded Image"
                ></Image>
              )}
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Upload file
                <VisuallyHiddenInput
                  // value={image}
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
                <span>Categories List</span>
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
                  options={cateList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Categories" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.id}
                        className="flex justify-between items-center px-3 py-2 border-b border-border-color"
                      >
                        <Image
                          loader={imageLoader}
                          key={`cate-img-${option.id}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={option.image == "" ? product_1 : option.image}
                          priority
                        ></Image>
                        <span key={`cate-name-${option.id}`}>
                          {option.name}
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
                <NavigateButton onClick={handleOpen}>
                  <AddIcon sx={{ marginRight: "0.25rem" }} />
                  New Category
                </NavigateButton>
              </div>
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell sx={{ minWidth: "18rem" }} align="center">
                    Image
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryList &&
                  categoryList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">
                        <span className="text-center">{item.name}</span>
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "grid",
                          placeContent: "center",
                          minWidth: "8rem",
                        }}
                        align="center"
                      >
                        <Image
                          loader={imageLoader}
                          // placeholder="blur"
                          className="w-[6.25rem] h-[6.25rem]"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={item.image == "" ? product_1 : item.image}
                          priority
                        ></Image>
                      </TableCell>
                      <TableCell sx={{ minWidth: "18rem" }} align="center">
                        <Button
                          onClick={() => openUpdateModal(item.id)}
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
              count={cateList.length}
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

export default AdminCategoryPage;
