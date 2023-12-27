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
import EditIcon from "@mui/icons-material/Edit";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { createData, patchData } from "@/hooks/useAdmin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import AdminProductItem from "./admin-product-item";
import { decodeToken } from "@/features/jwt-decode";
import { warningMessage } from "@/features/toasting";
import AdminProductItem from "./admin-product-item";

// const AdminProductItem = dynamic(() => import("./admin-product-item"), {
//   ssr: false,
//   loading: () => <LoadingComponent />,
// });

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
  token?: { accessToken?: string; refreshToken?: string };
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
  const { token, products, categories, brands, styleValues } = props;

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
  const [styleValueList, setStyleValueList] = useState<
    StyleValue[] | undefined
  >(undefined);
  const [styleValueNames, setStyleValueNames] = useState<string[]>([]);
  const [styleList, setStyleList] = useState<StyleList | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState<Product | null>(null);
  const [openProductItem, setOpenProductItem] = useState<boolean>(false);

  useEffect(() => {
    products &&
      products.length > 0 &&
      setProductList(
        products.sort((a, b) => b.productId - a.productId).slice(0, rowsPerPage)
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
  }, [products, rowsPerPage, token]);

  const handleOpenProductItem = (product: Product) => {
    setProductDetail(product);
    setProductName(product.name);
    setOpenProductItem(true);
  };
  const handleCloseProductItem = () => {
    setProductName("");
    setOpenProductItem(false);
  };

  const [page, setPage] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    resetProductItem();
    setUpdate(false);
    setOpen(false);
  };
  const handleOpenDetail = (product: Product) => {
    setProductDetail(product);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    resetProductItem();
    setOpenDetail(false);
  };

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
  let isCreating = false;

  async function handleCreateProduct(e: { preventDefault: () => void }) {
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
    if (isCreating) return;
    isCreating = true;

    const formData = new FormData();
    formData.append("name", productItem.name);
    formData.append("image", image);
    formData.append("description", productItem.description || "");
    formData.append("categoryId", productItem.categoryName);
    formData.append(
      "brandId",
      brands
        .find((brand) => brand.name === productItem.brandName)
        ?.brandId.toString() || ""
    );
    formData.append(
      "styleValueIds",
      Object.values(changeStyleNameToId()).join(",")
    );
    // const payload = {
    //   ...productItem,
    //   name: productItem.name,
    //   description: productItem.description || "",
    //   image: productItem.image,
    //   categoryId: productItem.categoryName,
    //   branId: productItem.brandName,
    //   styleValueIds: Object.values(changeStyleNameToId()).join(","),
    // };
    try {
      const id = toast.loading("Tạo sản phẩm mới...");
      const res = await createData(
        "/api/v1/users/admin/products",
        getCookie("accessToken")!,
        formData
      );
      if (res.success) {
        toast.update(id, {
          render: `Tạo sản phẩm mới thành công`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        resetProductItem();
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
          render: "Sản phẩm đã tồn tại",
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
    } catch (e) {
      toast.dismiss();
      console.error(e);
    } finally {
      isCreating = false;
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
      isSelling: false,
      isActive: false,
    });
    setStyleValueList(undefined);
    setStyleValueNames([]);
    setImage("");
    setProductDetail(null);
    setUpdate(false);
  }

  function openUpdateProduct(e: any, product: Product) {
    e.preventDefault();
    setUpdate(true);
    setProductDetail(product);
    setProductItem(product);
    handleOpen();
  }

  let isUpdating = false;
  async function handleUpdateProduct(event: any) {
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

    const formData = new FormData();
    formData.append("name", productItem.name);
    if (image !== "") {
      formData.append("image", image);
    }
    formData.append("description", productItem.description || "");
    formData.append(
      "brandId",
      brands
        .find((brand) => brand.name === productItem.brandName)
        ?.brandId.toString() || ""
    );

    try {
      const id = toast.loading("Đang cập nhật...");
      const res = await patchData(
        `/api/v1/users/admin/products/${productDetail?.productId}`,
        getCookie("accessToken")!,
        formData,
        "multipart/form-data"
      );
      const newProductList = productList.map((item) => {
        if (item.productId == productDetail?.productId) {
        }
        return item;
      });

      handleClose();
      setProductList(newProductList);
      resetProductItem();
      if (res.success) {
        toast.update(id, {
          render: `Cập nhật thành công`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        router.refresh();
      } else if (res.statusCode == 409) {
        toast.update(id, {
          render: `Sản phẩm cập nhật đã trùng với một sản phẩm khác`,
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
      } else
        toast.update(id, {
          render: `Lỗi hệ thống`,
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
    } catch (error) {
      toast.dismiss();
      console.error(error);
    } finally {
      isUpdating = false;
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
        open={openDetail}
        onClose={handleCloseDetail}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Chi tiết sản phẩm
          </h2>
          <div className="col-span-full grid grid-flow-col grid-cols-12 ">
            <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium p-1">
              <div className="grid items-center w-fit gap-x-2">
                {productDetail && productDetail.image ? (
                  <Image
                    loader={imageLoader}
                    blurDataURL={productDetail.image}
                    placeholder="blur"
                    className="w-[8rem] h-[8rem] p-1 border border-border-color"
                    width={300}
                    height={300}
                    src={productDetail.image}
                    alt="Uploaded Image"
                  ></Image>
                ) : (
                  <p className="grid place-content-center text-xl text-text-color">
                    Không có ảnh sản phẩm
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-full grid items-center gap-x-2 p-1">
              <span className="text-lg font-semibold text-secondary-color">
                {productDetail?.name}
              </span>
            </div>
            <div className="col-span-full grid items-center text-sm text-text-color gap-x-2 p-1">
              <span>Mô tả: {productDetail?.description}</span>
            </div>
            <div className="col-span-full grid items-center gap-x-2 text-sm text-text-color p-1">
              <span>Danh mục: {productDetail?.categoryName}</span>
            </div>
            <div className="col-span-full grid items-center gap-x-2 text-sm text-text-color p-1">
              <span>Thương hiệu: {productDetail?.brandName}</span>
            </div>
            <div className="col-span-full grid items-center gap-x-2 text-sm text-text-color p-1">
              <span>
                Giá sản phẩm: {FormatPrice(productDetail?.priceMin!)} VNĐ
              </span>
            </div>
            <div className="col-span-full grid items-center gap-x-2 text-sm text-text-color p-1">
              <span>
                Tổng số lượng: {productDetail?.totalQuantity} sản phẩm
              </span>
            </div>
            <div className="col-span-full grid items-center gap-x-2 text-sm text-text-color p-1">
              <span>Số lượng đã bán: {productDetail?.totalSold} sản phẩm</span>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            {isUpdate ? `Cập nhật sản phẩm` : "Tạo mới"}
          </h2>
          <form
            onSubmit={
              isUpdate
                ? (event) => handleUpdateProduct(event)
                : (event) => handleCreateProduct(event)
            }
            className="col-span-full grid grid-flow-col grid-cols-12 "
          >
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Name">
                  Tên sản phẩm
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
                  label="Tên sản phẩm"
                />
              </FormControl>
            </div>
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Description">
                  Mô tả
                </InputLabel>
                <OutlinedInput
                  inputProps={{ maxLength: 800 }}
                  type="text"
                  rows={4}
                  // className="h-[8rem]"
                  multiline
                  autoComplete="true"
                  fullWidth
                  id="Description"
                  name="description"
                  value={productItem.description}
                  onChange={handleProductItem}
                  label="Mô tả"
                />
              </FormControl>
            </div>
            {!isUpdate && (
              <>
                <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
                  <FormControl className="col-span-full">
                    <InputLabel className="mb-2" htmlFor="Category">
                      Danh mục
                    </InputLabel>
                    <Select
                      required
                      labelId="Category"
                      id="Category"
                      name="categoryName"
                      value={productItem.categoryName}
                      label="Danh mục"
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
                              .filter(
                                (styleValue) => styleValue.styleName == name
                              )
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
              </>
            )}
            <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
              <FormControl className="col-span-full">
                <InputLabel className="mb-2" htmlFor="Brand">
                  Thương hiệu
                </InputLabel>
                <Select
                  required
                  labelId="brand"
                  id="Brand"
                  name="brandName"
                  value={productItem.brandName}
                  label="Thương hiệu"
                  onChange={handleProductItem}
                >
                  {brands &&
                    brands.length > 0 &&
                    brands.map((brand) => {
                      return (
                        <MenuItem key={brand.brandId} value={brand.name}>
                          {brand.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-full grid place-items-center text-sm text-[#999] font-medium my-4">
              <div className="grid grid-flow-col w-fit gap-x-2">
                {productItem && productItem.image ? (
                  <Image
                    loader={imageLoader}
                    blurDataURL={productItem.image}
                    placeholder="blur"
                    className="w-[6.25rem] h-[6.25rem] rounded-md"
                    width={300}
                    height={300}
                    src={productItem.image}
                    alt="Uploaded Image"
                  ></Image>
                ) : (
                  <p className="grid place-content-center text-xl text-text-color">
                    Không có ảnh nào
                  </p>
                )}
              </div>
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
      <AdminProductItem
        productName={productName}
        products={products}
        openProductItem={openProductItem}
        handleCloseProductItem={handleCloseProductItem}
        styleValues={styleValues}
        productId={productDetail?.productId!}
      />
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
                <span> Danh sách sản phẩm</span>
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
                    <TextField {...params} label="Sản phẩm" />
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
                          blurDataURL={option.image || product_1.src}
                          placeholder="blur"
                          key={`product-img-${option.productId}`}
                          // placeholder="blur"
                          className="w-[4.25rem] h-[4.25rem] outline outline-1 outline-border-color"
                          width={120}
                          height={120}
                          alt="productImg"
                          src={option.image || product_1}
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
                    Sản phẩm mới
                  </NavigateButton>
                </div>
              </div>
            </Title>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Giá Mặc Định</TableCell>
                  <TableCell>Giá Sale</TableCell>
                  <TableCell>Tổng số lượng</TableCell>
                  <TableCell>Đã bán</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      <span>Quản lý phân loại </span>
                      <span>Sửa</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList &&
                  productList.length > 0 &&
                  productList.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell
                        onClick={() => handleOpenDetail(item)}
                        className="hover:cursor-pointer hover:bg-primary-color hover:text-white transition-colors truncate"
                        sx={{ minWidth: "14rem", maxWidth: "16rem" }}
                      >
                        <span>{item.name}</span>
                      </TableCell>
                      <TableCell sx={{ minWidth: "5rem", minHeight: "5rem" }}>
                        <Image
                          className="w-[4rem] h-[4rem] outline outline-1 outline-border-color p-1"
                          loader={imageLoader}
                          width={80}
                          height={80}
                          alt="productImg"
                          src={item.image}
                        ></Image>
                      </TableCell>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {FormatPrice(item.priceMin)} VNĐ
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="max-md:block max-md:w-max">
                          {item.priceMin > item.promotionalPriceMin
                            ? `${FormatPrice(item.promotionalPriceMin)} VNĐ`
                            : "Không giảm giá"}
                        </span>
                      </TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.totalSold}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-x-4 justify-around">
                          <Button
                            onClick={() => handleOpenProductItem(item)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "transparent",
                                opacity: "0.6",
                              },
                              color: "#639df1",
                            }}
                          >
                            <AddIcon sx={{ fontSize: "2rem" }} />
                          </Button>
                          <Button
                            onClick={(e) => openUpdateProduct(e, item)}
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
                        </div>
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
