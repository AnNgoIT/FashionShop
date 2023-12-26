"use client";
import { FormatPrice } from "@/features/product/FilterAmount";
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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Product, StyleValue, productItem } from "@/features/types";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";

import {
  VisuallyHiddenInput,
  imageLoader,
  modalProductItemStyle,
  modalStyle,
} from "@/features/img-loading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { getCookie, hasCookie } from "cookies-next";
import { createData, getDataAdmin, patchData } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { warningMessage } from "@/features/toasting";
import { toast } from "react-toastify";
import { validateProductItemForm } from "@/features/validation";
import FormHelperText from "@mui/material/FormHelperText";
import ProductDetail from "../product/detail";
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

export type ProductItemError = {
  quantity: string;
  price: string;
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
  const [errors, setErrors] = useState<ProductItemError>({
    quantity: "",
    price: "",
  });
  const [productItemList, setProductItemList] = useState<productItem[]>([]);

  const [styleValueList, setStyleValueList] = useState<
    StyleValue[] | undefined
  >(undefined);
  const [styleValueNames, setStyleValueNames] = useState<string[]>([]);
  const [styleList, setStyleList] = useState<StyleList | null>(null);

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

      const productItemList = await getDataAdmin(
        `/api/v1/productItems/parent/${productId}`,
        getCookie("accessToken")!
      );
      if (productItemList.success) {
        setProductItemList(productItemList.result.content);
      } else setProductItemList([]);
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

  function handleClose() {
    resetProductItem();
    setProductItemList([]);
    setImage("");
    setStyleList(null);
    setStyleValueList(undefined);
    handleCloseProductItem(false);
    setErrors({
      quantity: "",
      price: "",
    });
  }

  const handleProductItem = (e: any) => {
    const value = e.target.value;
    setProductItem({
      ...productItem,
      [e.target.name]: value,
    });

    // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
    setErrors({
      quantity: "",
      price: "",
    });
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
          // Xóa thông báo lỗi khi người dùng thay đổi giá trị trong trường
          setErrors({
            quantity: "",
            price: "",
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const isError = (error: ProductItemError) => {
    for (const key in error) {
      if (error[key as keyof ProductItemError] !== "") {
        return false; // Nếu có ít nhất một giá trị trống, trả về true
      }
    }
    return true; // Nếu tất cả giá trị đều không trống, trả về false
  };

  let isCreating = false;
  async function handleCreateProductItem(e: { preventDefault: () => void }) {
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
    formData.append("productId", productItem.parentId.toString());
    formData.append("image", image);
    formData.append("quantity", productItem.quantity.toString() || "");
    formData.append("price", productItem.price.toString());
    formData.append(
      "styleValueIds",
      Object.values(changeStyleNameToId()).join(",")
    );

    const formErrors = validateProductItemForm(productItem);

    if (isError(formErrors)) {
      try {
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
          productItemList &&
            setProductItemList([...productItemList, res.result]);
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
            render: `Phân loại này của sản phẩm đã tồn tại`,
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
      } catch (err) {
        console.error(err);
      } finally {
        isCreating = false;
      }
    } else setErrors(formErrors);
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
    setUpdate(false);
    setImage("");
  }

  function openUpdateProductItem(e: any, productItem: productItem) {
    e.preventDefault();
    setUpdate(true);
    setImage("");
    setProductItem(productItem);
  }

  let isUpdating = false;
  async function handleUpdateProductItem(event: any) {
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
    formData.append("quantity", productItem.quantity.toString());
    if (image !== "") {
      formData.append("image", image);
    }
    formData.append("price", productItem.price.toString());

    const formErrors = validateProductItemForm(productItem);

    if (isError(formErrors)) {
      try {
        const id = toast.loading("Đang cập nhật...");
        const res = await patchData(
          `/api/v1/users/admin/productItems/${productItem?.productItemId}`,
          getCookie("accessToken")!,
          formData,
          "multipart/form-data"
        );
        setProductItemList((productList: productItem[]) =>
          productList.map((item: productItem) =>
            item.productItemId === productItem.productItemId
              ? {
                  ...item,
                  image: res.result.image,
                  quantity: res.result.quantity,
                  price: res.result.price,
                }
              : item
          )
        );
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
      } catch (e) {
        console.error(e);
      } finally {
        isUpdating = false;
      }
    } else setErrors(formErrors);
  }

  return (
    <Modal
      open={openProductItem}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalProductItemStyle}>
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
              {isUpdate ? `Cập nhật sản phẩm` : "Tạo sản phẩm mới"}
            </h2>
            <form
              onSubmit={(event) => handleUpdateProductItem(event)}
              className="col-span-full grid grid-flow-col grid-cols-12 "
            >
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
                  Lưu
                </button>
              </div>
            </form>
          </Box>
        </Modal> */}
        <div className="w-full min-h-[8rem]">
          <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4">
            Danh sách phân loại sản phẩm
          </h2>
          {productItemList && productItemList.length > 0 ? (
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
                      {productItemList
                        .sort((a, b) => b.productItemId - a.productItemId)
                        .map((item) => (
                          <TableRow key={item.productItemId}>
                            <TableCell
                              sx={{ minWidth: "5rem", minHeight: "5rem" }}
                            >
                              <Image
                                className="w-[5rem] h-[5rem] outline outline-1 outline-border-color p-1"
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
                            <TableCell>
                              {" "}
                              <Button
                                onClick={(e) => openUpdateProductItem(e, item)}
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
                </Paper>
              </Grid>
            </Container>
          ) : (
            <div className="text-lg min-h-[6rem] grid place-content-center p-4 text-secondary-color">
              Không có phân loại sản phẩm nào
            </div>
          )}
        </div>
        <h2 className="w-full text-2xl tracking-[0] text-text-color uppercase font-semibold text-center pb-4 mt-8">
          {isUpdate ? "Cập nhật phân loại sản phẩm" : "Tạo phân loại sản phẩm"}
        </h2>
        <form
          onSubmit={
            isUpdate
              ? (event) => handleUpdateProductItem(event)
              : (event) => handleCreateProductItem(event)
          }
          className="grid grid-flow-col grid-cols-12"
        >
          {!isUpdate && (
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
          )}
          <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
            <FormControl
              className="col-span-8 col-start-3"
              error={errors.quantity !== ""}
            >
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
              <FormHelperText id="quantity-error">
                {errors.quantity}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="col-span-full grid grid-flow-col place-content-between grid-cols-12 text-sm text-[#999] font-medium mb-4">
            <FormControl
              className="col-span-8 col-start-3"
              error={errors.price !== ""}
            >
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
              <FormHelperText id="price-error">{errors.price}</FormHelperText>
            </FormControl>
          </div>
          {styleValueList &&
            styleValueNames &&
            styleList &&
            styleValueNames.length > 0 &&
            !isUpdate &&
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
          <div
            className={`col-span-8 col-start-3 ${
              isUpdate ? "flex gap-x-2 justify-end" : ""
            }`}
          >
            {isUpdate && (
              <button
                onClick={() => resetProductItem()}
                className="bg-primary-color transition-all duration-200 hover:bg-text-color py-[8px] 
                            float-right px-[15px] text-white rounded-[5px]"
                type="button"
              >
                Trở về
              </button>
            )}
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
  );
};

export default AdminProductItem;
