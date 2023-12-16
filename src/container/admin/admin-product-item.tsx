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
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  modalProductItemStyle,
  modalStyle,
} from "@/features/img-loading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { getCookie } from "cookies-next";
import { createData, getDataAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { toast } from "react-toastify";
import { LoadingComponent } from "@/components/loading";

type AdminProductItemProps = {
  productId: number;
  productName: string;
  products: Product[];
  openProductItem: boolean;
  handleCloseProductItem: Dispatch<SetStateAction<boolean>>;
  styleValues: StyleValue[];
};

type StyleList = {
  [x: string]: string;
};

const AdminProductItem = (props: AdminProductItemProps) => {
  const router = useRouter();
  const {
    productId,
    productName,
    products,
    openProductItem,
    handleCloseProductItem,
    styleValues,
  } = props;

  const [productItem, setProductItem] = useState<productItem>({
    productItemId: -1,
    parentId: productId,
    parentName: productName,
    quantity: 0,
    sold: 0,
    image: "",
    price: 0,
    promotionalPrice: 0,
    styleValueNames: [],
    sku: "",
  });
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productList, setProductList] = useState<productItem[] | undefined>(
    undefined
  );

  const [styleValueList, setStyleValueList] = useState<
    StyleValue[] | undefined
  >(undefined);
  const [styleValueNames, setStyleValueNames] = useState<string[]>([]);
  const [styleList, setStyleList] = useState<StyleList | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const handleProductName = (name: string, id: number) => {
      setProductItem({
        ...productItem,
        parentName: name,
        parentId: id,
        image: "",
      });

      let newStyleValueList: StyleValue[] = [];
      let newStyleList: StyleList = {};

      const styleNames = products.find(
        (item) => item.name === name
      )!.styleNames;
      const productItemStyles = products.find(
        (item) => item.name === name
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
    const handleProductItemList = async (productId: number) => {
      const productItemList = await getDataAdmin(
        `/api/v1/productItems/parent/${productId}`,
        getCookie("accessToken")!
      );
      if (productItemList.success) {
        setProductList(productItemList.result.content);
      } else setProductList([]);
    };

    if (productName !== "" && productId !== -1) {
      handleProductName(productName, productId);
      handleProductItemList(productId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName, productId]);

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

  async function handleCreateProduct(e: { preventDefault: () => void }) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", productItem.parentId.toString());
    formData.append("image", image);
    formData.append("quantity", productItem.quantity.toString() || "");
    formData.append("price", productItem.price.toString());
    formData.append(
      "styleValueIds",
      Object.values(changeStyleNameToId()).join(",")
    );
    const id = toast.loading("Tạo sản phẩm mới...");
    const res = await createData(
      "/api/v1/users/admin/productItems",
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
      productList && setProductList([...productList, res.result]);
      // handleClose();
      router.refresh();
    } else if (res.statusCode == 403 || res.statusCode == 401) {
      toast.update(id, {
        render: `Phiên đăng nhập hết hạn, đang tạo phiên mới`,
        type: "warning",
        autoClose: 500,
        isLoading: false,
      });
      router.refresh();
      handleClose();
    } else if (res.statusCode == 409) {
      toast.update(id, {
        render: `phân loại này đã tồn tại`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else if (res.statusCode == 400) {
      toast.update(id, {
        render: `Lỗi nhập dữ liệu không trùng khớp`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    } else if (res.status == 500) {
      handleClose();
      toast.update(id, {
        render: `Lỗi hệ thống`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
    }
  }
  function handleClose() {
    resetProductItem();
    setProductList([]);
    setImage("");
    setStyleList(null);
    setStyleValueList(undefined);
    handleCloseProductItem(false);
  }

  function resetProductItem() {
    setProductItem({
      productItemId: -1,
      parentId: productId,
      parentName: productName,
      quantity: 0,
      sold: 0,
      image: "",
      price: 0,
      promotionalPrice: 0,
      styleValueNames: [],
      sku: "",
    });
    setImage("");
  }

  return (
    <Modal
      open={openProductItem}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalProductItemStyle}>
        <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
          Tạo phân loại sản phẩm
        </h2>
        <form
          onSubmit={(event) => handleCreateProduct(event)}
          className="grid grid-flow-col grid-cols-12"
        >
          <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
            <FormControl className="col-span-8 col-start-3">
              <InputLabel className="mb-2" htmlFor="parentName">
                Tên sản phẩm
              </InputLabel>
              <OutlinedInput
                required
                id="parentName"
                name="parentName"
                disabled={true}
                readOnly={true}
                value={productItem.parentName}
                label="Tên sản phẩm"
              ></OutlinedInput>
            </FormControl>
          </div>
          <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
            <FormControl className="col-span-8 col-start-3">
              <InputLabel className="mb-2" htmlFor="Quantity">
                Số lượng
              </InputLabel>
              <OutlinedInput
                type="number"
                required
                autoComplete="off"
                fullWidth
                id="Quantity"
                name="quantity"
                value={productItem.quantity}
                onChange={handleProductItem}
                label="Số lượng"
              />
            </FormControl>
          </div>
          <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
            <FormControl className="col-span-8 col-start-3">
              <InputLabel className="mb-2" htmlFor="Price">
                Giá
              </InputLabel>
              <OutlinedInput
                type="number"
                required
                autoComplete="off"
                fullWidth
                id="Price"
                name="price"
                value={productItem.price}
                onChange={handleProductItem}
                label="Giá"
              />
            </FormControl>
          </div>
          {styleValueList &&
            styleValueNames &&
            styleList &&
            styleValueNames.length > 0 &&
            styleValueNames.map((name) => {
              return (
                <div
                  key={`name-${name}`}
                  className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4"
                >
                  <FormControl className="col-span-8 col-start-3">
                    <InputLabel className="mb-2" htmlFor={name}>
                      {name == "Color"
                        ? "Màu sắc"
                        : name == "Size"
                        ? "Kích cỡ"
                        : "Khác"}
                    </InputLabel>
                    <Select
                      id={`${name}`}
                      name={name}
                      value={styleList[name]}
                      onChange={handleStyleList}
                      required
                      input={
                        <OutlinedInput
                          label={
                            name == "Color"
                              ? "Màu sắc"
                              : name == "Size"
                              ? "Kích cỡ"
                              : "Khác"
                          }
                        />
                      }
                    >
                      {styleValueList
                        .filter((styleValue) => styleValue.styleName == name)
                        .map((style) => (
                          <MenuItem key={style.styleValueId} value={style.name}>
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
              {productItem && image && productItem.image ? (
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
                required
                onChange={(e) => handleImageUpload(e)}
                type="file"
              />
            </Button>
          </div>
          <div className="col-span-8 col-start-3">
            <button
              className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                           float-right px-[15px] text-white rounded-[5px]"
              type="submit"
            >
              {isUpdate ? "Lưu" : "Tạo"}
            </button>
          </div>
        </form>
        <div className="w-full mt-16 min-h-[8rem]">
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Danh sách phân loại sản phẩm
          </h2>
          {productList && productList.length > 0 ? (
            <Container maxWidth="xl" sx={{ paddingX: "0px!important" }}>
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
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Style</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Sold</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productList
                        .sort((a, b) => b.productItemId - a.productItemId)
                        .map((item) => (
                          <TableRow key={item.productItemId}>
                            <TableCell
                              sx={{ minWidth: "5rem", minHeight: "5rem" }}
                            >
                              <Image
                                className="w-[5rem] h-[5rem] outline outline-1 outline-border-color"
                                loader={imageLoader}
                                placeholder="blur"
                                blurDataURL={item.image}
                                width={80}
                                height={80}
                                alt="productImg"
                                src={item.image}
                              ></Image>
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
                              <p className="truncate w-full">
                                {item.styleValueNames.join(" - ")}
                              </p>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              <span className="max-md:block max-md:w-max">
                                {FormatPrice(item.price)} VNĐ
                              </span>
                            </TableCell>
                            <TableCell>{item.sold}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Container>
          ) : productList && productList.length == 0 ? (
            <div className="text-lg min-h-[6rem] grid place-content-center p-4 text-secondary-color">
              Không có phân loại sản phẩm nào
            </div>
          ) : (
            <LoadingComponent />
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default AdminProductItem;
