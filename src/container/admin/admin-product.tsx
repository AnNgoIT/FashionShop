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
import { Brand, Category, Product, StyleValue } from "@/features/types";
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
import { product_1 } from "@/assests/images";
import { CldImage } from "next-cloudinary";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getCookie } from "cookies-next";
import { createData } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type AdminProductProps = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  styleValues: StyleValue[];
};

type StyleList = {
  [x: string]: string[];
};

const AdminProduct = (props: AdminProductProps) => {
  const router = useRouter();
  const { products, categories, brands, styleValues } = props;

  const [productItem, setProductItem] = useState<Product>({
    productId: -1,
    name: "",
    image: "",
    categoryId: 0,
    categoryName: "",
    brandId: 0,
    brandName: "",
    totalQuantity: 0,
    totalSold: 0,
    priceMin: 0,
    promotionalPriceMin: 0,
    rating: 0,
    styleNames: [],
    styleValueNames: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isSelling: false,
    isActive: false,
  });

  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productList, setProductList] = useState<Product[]>(
    products.sort((a, b) => b.productId - a.productId).slice(0, rowsPerPage)
  );

  useEffect(() => {
    products &&
      products.length > 0 &&
      setProductList(
        products.sort((a, b) => b.productId - a.productId).slice(0, rowsPerPage)
      );
  }, [products, rowsPerPage]);

  const [styleValueList, setStyleValueList] = useState<
    StyleValue[] | undefined
  >(undefined);
  const [styleValueNames, setStyleValueNames] = useState<string[]>([]);
  const [styleList, setStyleList] = useState<StyleList | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>("-1");
  const [page, setPage] = useState(0);

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
      if (
        styleList &&
        styleList.hasOwnProperty(key) &&
        Array.isArray(styleList[key])
      ) {
        result[key] = styleList[key].map((item) => {
          let foundItem = styleValues.find(
            (element: any) => element.name === item
          );
          return foundItem ? foundItem.styleValueId : null;
        });
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
  const handleStyleList = (e: any) => {
    console.log(e.target.value);
    const value = e.target.value;
    setStyleList({
      ...styleList,
      [e.target.name]: value,
    });
  };

  const handleCategories = (e: any) => {
    setProductItem({
      ...productItem,
      categoryName: e.target.value,
    });
    const category = categories.filter(
      (item) => item.categoryId === e.target.value
    )[0].styleNames;

    let newStyleValueList: StyleValue[] = [];
    let newStyleList: StyleList = {};
    category &&
      category.forEach((name: string) => {
        newStyleList = { ...newStyleList, [name]: [] };
        newStyleValueList.push(
          ...styleValues.filter((styleValue) => styleValue.styleName === name)
        );
      });
    setStyleValueNames(category);
    setStyleList(newStyleList);
    setStyleValueList(newStyleValueList);
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
    const newProductList = products.slice(startIndex, startIndex + rowsPerPage);

    // Cập nhật trang và danh sách danh mục
    setPage(newPage);
    setProductList(newProductList);
  };

  async function handleCreateProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productItem.name);
    formData.append("image", image);
    formData.append("description", productItem.description || "");
    formData.append("categoryId", productItem.categoryName);
    formData.append("brandId", productItem.brandName);
    formData.append(
      "styleValueIds",
      Object.values(changeStyleNameToId()).join(",")
    );
    const payload = {
      ...productItem,
      name: productItem.name,
      description: productItem.description || "",
      image: productItem.image,
      categoryId: productItem.categoryName,
      branId: productItem.brandName,
      styleValueIds: Object.values(changeStyleNameToId()).join(","),
    };
    const id = toast.loading("Creating...");
    const res = await createData(
      "/api/v1/users/admin/products",
      getCookie("accessToken")!,
      formData
    );
    if (res.success) {
      toast.update(id, {
        render: `Created Product Success`,
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
        render: "Product already existed",
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

  function resetProductItem() {
    setProductItem({
      productId: -1,
      name: "",
      image: "",
      categoryId: 0,
      categoryName: "",
      brandId: 0,
      brandName: "",
      totalQuantity: 0,
      totalSold: 0,
      priceMin: 0,
      promotionalPriceMin: 0,
      rating: 0,
      styleNames: [],
      styleValueNames: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isSelling: false,
      isActive: false,
    });
    setPage(0);
    setRowsPerPage(5);
    setStyleValueList(undefined);
    setStyleValueNames([]);
    setImage("");
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
            {isUpdate ? `Product ID: ${updateId}` : "Create Product"}
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
                <InputLabel className="mb-2" htmlFor="Name">
                  Name
                </InputLabel>
                <OutlinedInput
                  required
                  autoComplete="off"
                  fullWidth
                  id="Name"
                  name="name"
                  value={productItem.name}
                  onChange={handleProductItem}
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
                  inputProps={{ maxLength: 1000 }}
                  type="text"
                  rows={1}
                  className="h-[5rem]"
                  multiline
                  autoComplete="true"
                  fullWidth
                  id="Description"
                  name="description"
                  value={productItem.description}
                  onChange={handleProductItem}
                  label="Description"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Category">
                  Category
                </InputLabel>
                <Select
                  required
                  labelId="Category"
                  id="Category"
                  name="categoryName"
                  value={productItem.categoryName}
                  label="Category"
                  onChange={handleCategories}
                >
                  {categories &&
                    categories.length > 0 &&
                    categories
                      // .filter(
                      //   (category, index, self) => category.parentName != null
                      // )
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
                <InputLabel className="mb-2" htmlFor="Brand">
                  Brand
                </InputLabel>
                <Select
                  required
                  labelId="brand"
                  id="Brand"
                  name="brandName"
                  value={productItem.brandName}
                  label="Brand"
                  onChange={handleProductItem}
                >
                  {brands &&
                    brands.length > 0 &&
                    brands.map((brand) => {
                      return (
                        <MenuItem key={brand.brandId} value={brand.brandId}>
                          {brand.name}
                        </MenuItem>
                      );
                    })}
                </Select>
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
                        multiple
                        name={name}
                        value={styleList[name]}
                        onChange={handleStyleList}
                        input={<OutlinedInput label={name} />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {styleValueList
                          .filter((styleValue) => styleValue.styleName == name)
                          .map((style) => (
                            <MenuItem
                              key={style.styleValueId}
                              value={style.name}
                            >
                              <Checkbox
                                checked={
                                  styleList[name].indexOf(style.name) > -1
                                }
                              />
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
                <span> Product List</span>
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
                        key={option.productId}
                        className="flex justify-between items-center gap-x-4 px-3 py-2 border-b border-border-color"
                      >
                        <Image
                          loader={imageLoader}
                          key={`product-img-${option.productId}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={option.image || product_1}
                          priority
                        ></Image>
                        <span key={`product-name-${option.productId}`}>
                          {option.name}
                        </span>
                      </li>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) => {
                    return tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.productId}
                        label={option.productId}
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
                  <TableCell>Image</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Total Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList &&
                  productList.length > 0 &&
                  productList.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell sx={{ minWidth: "14rem", maxWidth: "16rem" }}>
                        <span>{item.name}</span>
                      </TableCell>
                      <TableCell sx={{ minWidth: "5rem", minHeight: "5rem" }}>
                        <CldImage
                          className="w-[5rem] h-[5rem] outline outline-1 outline-border-color"
                          loader={imageLoader}
                          width={80}
                          height={80}
                          alt="productImg"
                          src={item.image}
                        ></CldImage>
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: "12rem",
                          maxWidth: "13rem",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <p className="truncate w-full">{item.description}</p>
                      </TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{`${
                        item.isSelling ? "Available" : "Sold out"
                      }`}</TableCell>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {FormatPrice(item.priceMin)} VNĐ
                        </span>
                      </TableCell>
                      <TableCell>{item.totalSold}</TableCell>
                      <TableCell>
                        <Button
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
              rowsPerPageOptions={[5, 10, 25, 50]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminProduct;
