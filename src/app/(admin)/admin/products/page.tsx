"use client";
import { FormatPrice, onlyNumbers } from "@/features/product/FilterAmount";
import Title from "@/components/dashboard/Title";
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
import UpdateIcon from "@mui/icons-material/Update";
import { modalStyle } from "@/app/(account)/profile/address/page";
import { Product } from "@/features/entities";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import { imageLoader } from "@/features/img-loading";
import { product_1 } from "@/assests/images";
import { VisuallyHiddenInput } from "@/app/(account)/profile/page";

const AdminProductPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDes] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sold, setProductSold] = useState<number>(0);
  const [promotionalPrice, setPromotionalPrice] = useState<number>(0);
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [isSelling, setIsSelling] = useState<boolean>(true);
  const [isUpdate, setUpdate] = useState<boolean>(false);

  const products = [
    {
      id: "1",
      name: "White Heels For Women",
      description: "",
      images: [],
      quantity: 20,
      sold: 0,
      price: 100000,
      promotionalPrice: 80000,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      isSelling: true,
    },
    {
      id: "2",
      name: "Croptop For Men",
      description: "",
      images: [],
      quantity: 20,
      sold: 0,
      price: 100000,
      promotionalPrice: 80000,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      isSelling: true,
    },
  ];

  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [productList, setProductList] = useState<Product[]>(
    products.slice(0, rowsPerPage)
  );

  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>("-1");
  const [page, setPage] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetProduct();
    setUpdate(false);
    setOpen(false);
  };
  const openUpdateModal = (id: string) => {
    const product = productList.find((product) => product.id === id);
    setName(product?.name!);
    setQuantity(product?.quantity!);
    setDes(product?.description!);
    setPrice(product?.price!);
    setUpdateId(id);
    setUpdate(true);
    handleOpen();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const imageUrl = event.target.result.toString();
            newImages.push(imageUrl);

            // If this is the last file, update state with all images
            if (i === files.length - 1) {
              setImages([...images, ...newImages]);
            }
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleCustomButtonClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newProductList = products.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setProductList(newProductList);
  };

  function handleCreateProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    const newId = productList[productList.length - 1].id!;
    const result: Product = {
      id: newId + 1,
      name,
      images,
      description,
      createdAt,
      updatedAt,
      price,
      promotionalPrice: price,
      quantity,
      sold,
      rating,
      isSelling,
    };
    const newProductList: Product[] = [...productList, result];
    setProductList(newProductList);
    resetProduct();
    handleClose();
  }

  const handleSearchProducts = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setProductList(products.slice(0, rowsPerPage));
    else {
      const newProductList = products.filter((item) =>
        item.name.includes(name)
      );
      setProductList(newProductList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setProductList(products.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  function resetProduct() {
    setName("");
    setQuantity(0);
    setDes("");
    setPrice(0);
    setPromotionalPrice(0);
    setProductSold(0);
    setImages([]);
  }

  function handleUpdateProduct(
    event: React.FormEvent<HTMLFormElement>,
    id: string
  ) {
    event.preventDefault();
    const newProductList = productList.map((item) => {
      if (item.id == id) {
        item = {
          id,
          name,
          description,
          images,
          price,
          promotionalPrice,
          quantity,
          sold,
          createdAt,
          updatedAt,
          rating,
          isSelling,
        };
      }
      return item;
    });
    setProductList(newProductList);
    resetProduct();
    setUpdateId("-1");
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
            {isUpdate ? `Product ID: ${updateId}` : "Create New Product"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateProduct(event, updateId)
                : (event) => handleCreateProduct(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Name
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="off"
                  fullWidth
                  id="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  // placeholder="Type your Name"
                  label="Name"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Description">
                  Description
                </InputLabel>
                <OutlinedInput
                  rows={1}
                  multiline
                  autoComplete="true"
                  fullWidth
                  id="Description"
                  value={description}
                  onChange={(event) => setDes(event.target.value)}
                  // placeholder="Type your Description"
                  label="Description"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Quantity">
                  Quantity
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="true"
                  fullWidth
                  id="Quantity"
                  value={quantity}
                  onKeyDown={(e) => onlyNumbers(e)}
                  onChange={(event) => setQuantity(+event.target.value)}
                  // placeholder="Type your Quantity"
                  label="Quantity"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Price">
                  Price
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="true"
                  fullWidth
                  id="Price"
                  value={price}
                  onKeyDown={(e) => onlyNumbers(e)}
                  onChange={(event) => setPrice(+event.target.value)}
                  // placeholder="Type your Price"
                  label="Price"
                />
              </FormControl>
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
            <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium my-4">
              <div className="grid grid-flow-col w-fit gap-x-2">
                {images &&
                  images.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        onClick={() => {
                          handleCustomButtonClick();
                        }}
                        className="w-[6.25rem] h-[6.25rem] rounded-md"
                        width={300}
                        height={300}
                        src={image}
                        alt="Uploaded Image"
                      ></Image>
                    );
                  })}
              </div>
              <Button
                sx={{ marginTop: "1rem", background: "#639df1" }}
                component="label"
                variant="contained"
                className="mt-4 bg-primary-color hover:bg-text-color w-max"
              >
                Upload file
                <VisuallyHiddenInput
                  // value={images}
                  multiple
                  onChange={(e) => handleImageUpload(e)}
                  type="file"
                />
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Products */}
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
                <span> Products List</span>
                <Autocomplete
                  sx={{ minWidth: 350 }}
                  onChange={(e, newProduct) =>
                    handleSearchProducts(e, newProduct?.name!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.name == "" ||
                    option.name == value.name
                  }
                  options={products}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Products" />
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
                          key={`product-img-${option.id}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={
                            option.images.length == 0
                              ? product_1
                              : option.images[0]
                          }
                          priority
                        ></Image>
                        <span key={`product-name-${option.id}`}>
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
                <div className="w-max">
                  <NavigateButton onClick={handleOpen}>
                    <AddIcon sx={{ marginRight: "0.25rem" }} />
                    New Product
                  </NavigateButton>
                </div>
              </div>
            </Title>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList &&
                  productList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell sx={{ maxWidth: "4rem" }}>
                        <p className="truncate w-full">{item.description}</p>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{`${
                        item.isSelling ? "Available" : "Sold out"
                      }`}</TableCell>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {FormatPrice(item.price)} VNĐ
                        </span>
                      </TableCell>
                      <TableCell>{item.sold}</TableCell>
                      <TableCell>
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
              count={products.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[1, 10, 25, 50]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminProductPage;
