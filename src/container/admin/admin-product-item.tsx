"use client";
import { FormatPrice } from "@/features/product/FilterAmount";
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
import React, { useEffect, useState } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import { Product, StyleValue, productItem } from "@/features/types";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import NavigateButton from "@/components/button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import {
  VisuallyHiddenInput,
  imageLoader,
  modalStyle,
} from "@/features/img-loading";
import { CldImage } from "next-cloudinary";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { getCookie } from "cookies-next";
import { createData } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type AdminProductItemProps = {
  products: Product[];
  productItems: productItem[];
  styleValues: StyleValue[];
};

type StyleList = {
  [x: string]: string;
};

const AdminProductItem = (props: AdminProductItemProps) => {
  const router = useRouter();
  const { products, productItems, styleValues } = props;

  const [productItem, setProductItem] = useState<productItem>({
    productItemId: -1,
    parentId: 0,
    parentName: "",
    quantity: 0,
    sold: 0,
    image: "",
    price: 0,
    promotionPrice: 0,
    styleValueNames: [],
    sku: "",
  });

  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productList, setProductList] = useState<productItem[]>(
    productItems
      .sort((a, b) => b.productItemId - a.productItemId)
      .slice(0, rowsPerPage)
  );

  const [styleValueList, setStyleValueList] = useState<
    StyleValue[] | undefined
  >(undefined);
  const [styleValueNames, setStyleValueNames] = useState<string[]>([]);
  const [styleList, setStyleList] = useState<StyleList | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>("-1");
  const [page, setPage] = useState(0);

  useEffect(() => {
    productItems &&
      setProductList(
        productItems
          .sort((a, b) => b.productItemId - a.productItemId)
          .slice(0, rowsPerPage)
      );
  }, [productItems, rowsPerPage]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetProductItem();
    setUpdate(false);
    setOpen(false);
  };
  // const openUpdateModal = (id: string) => {
  //   const product = productList.find((product) => product.productId === id);
  //   // setName(product?.name!);
  //   // setQuantity(product?.totalQuantity!);
  //   // setDes(product?.description!);
  //   // setPrice(product?.priceMin!);
  //   setUpdateId(id);
  //   setUpdate(true);
  //   handleOpen();
  // };

  function changeStyleNameToId() {
    let result: any = {};
    for (let key in styleList) {
      if (styleList && styleList.hasOwnProperty(key)) {
        result[key] = styleValueList!.find(
          (element: StyleValue) => element.name === styleList[key]
        )?.styleValueId;
      }
    }
    return result;
  }

  const handleProductItem = (e: any) => {
    const value = e.target.value;
    setProductItem({
      ...productItem,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
  };

  const handleProductName = (e: any) => {
    const value = e.target.value;
    setProductItem({
      ...productItem,
      parentName: value,
    });

    let newStyleValueList: StyleValue[] = [];
    let newStyleList: StyleList = {};

    const styleNames = products.find(
      (item) => item.productId === e.target.value
    )!.styleNames;
    const productItemStyles = products.find(
      (item) => item.productId === e.target.value
    )!.styleValueNames;

    styleNames &&
      styleNames.forEach((styleName: string) => {
        newStyleList = { ...newStyleList, [styleName]: "" };
      });

    newStyleValueList.push(
      ...styleValues.filter((styleValue) =>
        productItemStyles.includes(styleValue.name)
      )
    );
    setStyleValueNames(styleNames);
    setStyleList(newStyleList);
    setStyleValueList(newStyleValueList);
  };

  const handleStyleList = (e: any) => {
    const value = e.target.value;
    setStyleList({
      ...styleList,
      [e.target.name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const imageUrl = e.target.result.toString();
          setProductItem({
            ...productItem,
            image: imageUrl,
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChangePage = (event: any, newPage: number) => {
    // Tính toán chỉ số bắt đầu mới của danh sách danh mục dựa trên số trang mới
    const startIndex = newPage * rowsPerPage;

    // Tạo một mảng mới từ danh sách danh mục ban đầu, bắt đầu từ chỉ số mới
    const newProductList = productItems.slice(
      startIndex,
      startIndex + rowsPerPage
    );

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setProductList(newProductList);
  };

  async function handleCreateProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", productItem.parentName.toString());
    formData.append("image", image);
    formData.append("quantity", productItem.quantity.toString() || "");
    formData.append("price", productItem.price.toString());
    formData.append(
      "styleValueIds",
      Object.values(changeStyleNameToId()).join(",")
    );
    const payload = {
      productId: productItem.parentName,
      quantity: productItem.quantity || 0,
      image: image,
      price: productItem.price || 0,
      styleValueIds: Object.values(changeStyleNameToId()).join(","),
    };
    const id = toast.loading("Creating...");
    const res = await createData(
      "/api/v1/users/admin/productItems",
      getCookie("accessToken")!,
      formData
    );
    if (res.success) {
      toast.update(id, {
        render: `Created Product Items Success`,
        type: "success",
        autoClose: 500,
        isLoading: false,
      });
      resetProductItem();
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
        render: "Product Item already existed",
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

  const handleSearchProductItems = (
    e: { preventDefault: () => void },
    name: string
  ) => {
    e.preventDefault();
    if (name == undefined) setProductList(productItems.slice(0, rowsPerPage));
    else {
      const newProductList = productItems.filter((item) =>
        item.parentName.includes(name)
      );
      setProductList(newProductList);
    }
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(() => {
      setProductList(productItems.slice(0, +event.target.value));
      return +event.target.value;
    });
    setPage(0);
  };

  function resetProductItem() {
    setProductItem({
      productItemId: -1,
      parentId: 0,
      parentName: "",
      quantity: 0,
      sold: 0,
      image: "",
      price: 0,
      promotionPrice: 0,
      styleValueNames: [],
      sku: "",
    });
    setPage(0);
    setRowsPerPage(5);
    setStyleValueList(undefined);
    setStyleValueNames([]);
  }

  // function handleUpdateProduct(
  //   event: React.FormEvent<HTMLFormElement>,
  //   id: string
  // ) {
  //   event.preventDefault();
  //   const newProductList = productList.map((item) => {
  //     if (item.productId == id) {
  //     }
  //     return item;
  //   });
  //   setProductList(newProductList);
  //   resetProductItem();
  //   setUpdateId("-1");
  //   handleClose();
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
            {isUpdate ? `Product ID: ${updateId}` : "Create Product Items"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => {} //handleUpdateProduct(event, updateId)
                : (event) => handleCreateProduct(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="parentName">
                  Product Name
                </InputLabel>
                <Select
                  required
                  id="parentName"
                  name="parentName"
                  value={productItem.parentName}
                  label="Product Name"
                  onChange={handleProductName}
                >
                  {products &&
                    products.length > 0 &&
                    products.map((product) => {
                      return (
                        <MenuItem
                          sx={{
                            maxWidth: "19.5rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          key={product.productId}
                          value={product.productId}
                        >
                          {product.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Quantity">
                  Quantity
                </InputLabel>
                <OutlinedInput
                  type="number"
                  autoComplete="off"
                  fullWidth
                  id="Quantity"
                  name="quantity"
                  value={productItem.quantity}
                  onChange={handleProductItem}
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
                  type="number"
                  autoComplete="off"
                  fullWidth
                  id="Price"
                  name="price"
                  value={productItem.price}
                  onChange={handleProductItem}
                  label="Price"
                />
              </FormControl>
            </div>
            {styleValueList &&
              styleValueNames &&
              styleList &&
              styleValueNames.map((name) => {
                return (
                  <div
                    key={`name-${name}`}
                    className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4"
                  >
                    <FormControl className="col-span-full">
                      <InputLabel className="mb-2" htmlFor={name}>
                        {name}
                      </InputLabel>
                      <Select
                        id={`${name}`}
                        name={name}
                        value={styleList[name]}
                        onChange={handleStyleList}
                        input={<OutlinedInput label={name} />}
                      >
                        {styleValueList
                          .filter((styleValue) => styleValue.styleName == name)
                          .map((style) => (
                            <MenuItem
                              key={style.styleValueId}
                              value={style.name}
                            >
                              <ListItemText primary={style.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                );
              })}
            <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium my-4">
              <div className="grid grid-flow-col w-fit gap-x-2">
                {productItem && productItem.image ? (
                  <Image
                    loader={imageLoader}
                    className="w-[6.25rem] h-[6.25rem] rounded-md"
                    width={300}
                    height={300}
                    src={productItem.image}
                    alt="Uploaded Image"
                    priority
                  ></Image>
                ) : (
                  <p className="grid place-content-center text-xl text-text-color">
                    No Image
                  </p>
                )}
              </div>
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
                <span> Product Item List</span>
                <Autocomplete
                  sx={{ minWidth: 350 }}
                  onChange={(e, newProduct) =>
                    handleSearchProductItems(e, newProduct?.parentName!)
                  }
                  isOptionEqualToValue={(option, value) =>
                    value == undefined ||
                    value.parentName == "" ||
                    option.parentName == value.parentName
                  }
                  options={productItems}
                  getOptionLabel={(option) => option.parentName}
                  renderInput={(params) => (
                    <TextField {...params} label="Product Items" />
                  )}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.productItemId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <Image
                          loader={imageLoader}
                          key={`product-item-img-${option.productItemId}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={68}
                          height={68}
                          alt="productImg"
                          src={option.image}
                          priority
                        ></Image>
                        <span key={`product-name-${option.productItemId}`}>
                          {option.parentName}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.productItemId}
                        label={option.productItemId}
                      />
                    ));
                  }}
                />
                <div className="w-max">
                  <NavigateButton onClick={handleOpen}>
                    <AddIcon sx={{ marginRight: "0.25rem" }} />
                    New Product Items
                  </NavigateButton>
                </div>
              </div>
            </Title>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Style</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList &&
                  productList.map((item) => (
                    <TableRow key={item.productItemId}>
                      <TableCell sx={{ minWidth: "14rem", maxWidth: "16rem" }}>
                        <span>{item.parentName}</span>
                      </TableCell>
                      <TableCell sx={{ minWidth: "5rem", minHeight: "5rem" }}>
                        <CldImage
                          loader={imageLoader}
                          className="w-[5rem] h-[5rem] outline outline-1 outline-border-color"
                          width={80}
                          height={80}
                          alt="productImg"
                          src={item.image}
                          priority
                        ></CldImage>
                      </TableCell>
                      <TableCell>{item.styleValueNames.join(",")}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {FormatPrice(item.price)} VNĐ
                        </span>
                      </TableCell>
                      <TableCell>{item.sold}</TableCell>
                      <TableCell>
                        {/* <Button
                          // onClick={() => openUpdateModal(item.productId)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                              opacity: "0.6",
                            },
                            color: "#639df1",
                          }}
                        >
                          <UpdateIcon />
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              sx={{ overflow: "visible" }}
              component="div"
              count={productItems.length}
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

export default AdminProductItem;
