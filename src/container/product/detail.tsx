"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCheck,
  faHeart,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FormatPrice, MaxAmounts } from "@/features/product/FilterAmount";
import { QuantityButton } from "@/components/button";
import RelatedProduct from "@/container/product/related-product";
import ContentSwitcher from "@/container/product/content-switcher";
import ImageMagnifier from "@/components/image-magnifier";
import { addProductItemToCart, useProductDetail } from "@/hooks/useProducts";
import { Product, StyleValue, productItem } from "@/features/types";
import usePath from "@/hooks/usePath";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import useLocal from "@/hooks/useLocalStorage";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type ProductDetailProps = {
  productId: string;
  color: StyleValue[];
  size: StyleValue[];
  relatedProduct: Product[];
  productItems: productItem[];
};

const ProductDetail = (props: ProductDetailProps) => {
  const { productId, color, size, relatedProduct, productItems } = props;
  const router = useRouter();
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const cart = useLocal();
  const [qty, setQty] = useState<number>(1);
  const [isSizeActive, setSizeActive] = useState<string[]>([]);
  const [isColorActive, setColorActive] = useState<string[]>([]);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [showProductItem, setShowProductItem] = useState(false);

  const [productItem, setProductItem] = useState<productItem>({
    productItemId: 0,
    parentId: 0,
    parentName: "",
    quantity: productItems[0].quantity,
    sold: 0,
    image: productItems[0].image,
    price: productItems[0].price,
    promotionalPrice: productItems[0].promotionalPrice,
    styleValueNames: [],
    sku: "",
  });

  function resetProductItem() {
    setProductItem({
      productItemId: 0,
      parentId: 0,
      parentName: "",
      quantity: productItems[0].quantity,
      sold: 0,
      image: productItems[0].image,
      price: productItems[0].price,
      promotionalPrice: productItems[0].promotionalPrice,
      styleValueNames: [],
      sku: "",
    });
    setQty(1);
    setSizeActive([]);
    setColorActive([]);
  }

  useEffect(() => {
    if (isColorActive.length > 0 && isSizeActive.length > 0) {
      const newProductItem = productItems.find(
        (productItem) =>
          productItem.styleValueNames.includes(isColorActive[0]) &&
          productItem.styleValueNames.includes(isSizeActive[0])
      );

      if (newProductItem) {
        setProductItem(newProductItem);
        setShowProductItem(true); // Khi đã tìm thấy sản phẩm phù hợp, hiển thị ảnh mới
      }
    } else if (isColorActive.length > 0) {
      const newProductItem = productItems.find((productItem) =>
        productItem.styleValueNames.includes(isColorActive[0])
      );

      if (newProductItem) {
        setProductItem(newProductItem);
        setShowProductItem(true); // Khi đã tìm thấy sản phẩm phù hợp, hiển thị ảnh mới
      }
    } else {
      setShowProductItem(false); // Nếu không có size hoặc color active, ẩn ảnh
    }
  }, [isColorActive, isSizeActive, productItems, showProductItem]);

  const { productDetail, isProductDetailError, isProductDetailLoading } =
    useProductDetail(productId);
  if (isProductDetailLoading)
    return (
      <>
        <main className="font-montserrat bg-white mt-[76px] relative z-0">
          <section className="lg:container lg:border-y-[10px] border-white bg-background py-16 md:py-28 px-8">
            <div className={`grid grid-cols-1`}>
              <div className="flex items-center justify-center flex-col lg:flex-row lg:justify-between ">
                <span className="text-2xl leading-[30px] tracking-[1px] uppercase font-semibold text-text-color mb-[10px] lg:mb-0">
                  {title}
                </span>
                <ul className="flex">
                  {urlLink &&
                    urlLink?.map((value: string, index: number) => {
                      const nextLink = urlLink![index + 1];
                      let thisLink = null;
                      if (nextLink !== undefined && value !== "home") {
                        thisLink = (
                          <>
                            <Link
                              className="group-hover:cursor-pointer group-hover:text-secondary-color
            transition-all duration-200 capitalize text-[18px]"
                              href={`/${value}`}
                            >
                              {value}
                            </Link>
                            <span className="px-[10px]">/</span>
                          </>
                        );
                      } else if (value === "home") {
                        thisLink = (
                          <>
                            <Link
                              className="group-hover:cursor-pointer group-hover:text-secondary-color
            transition-all duration-200 capitalize text-[18px]"
                              href={`/`}
                            >
                              {value}
                            </Link>
                            <span className="px-[10px]">/</span>
                          </>
                        );
                      } else
                        thisLink = (
                          <span className="capitalize text-[18px]">
                            {value}
                          </span>
                        );
                      return (
                        <li
                          key={index}
                          className={`font-medium ${nextLink ? `group` : ``}`}
                        >
                          {thisLink}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </section>
        </main>
        <section className="container grid grid-cols-12 mt-8 md:mt-12 p-4 overflow-hidden">
          <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
            <div className="col-span-full md:col-span-6 lg:col-span-5 lg:col-start-2 xl:col-span-4 xl:col-start-2 outline outline-1 outline-border-color h-fit">
              <Skeleton
                variant="rectangular"
                sx={{ width: "100%", height: "100%" }}
                height={485}
              ></Skeleton>
            </div>
            <div
              className={`col-span-full md:col-span-6 lg:col-span-5 xl:col-span-5`}
            >
              <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
                <Skeleton
                  variant="rounded"
                  sx={{ margin: "0.25rem 0", width: "100%", height: "100%" }}
                ></Skeleton>
              </h3>
              <h1 className="text-primary-color font-bold">
                <Skeleton
                  variant="rounded"
                  sx={{ margin: "0.25rem 0" }}
                  height={20}
                  width={532}
                ></Skeleton>
              </h1>
              <ul className=" border-b-[1px] border-border-color text-base py-4">
                <li className="flex items-center text-sm">
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "0.25rem 0" }}
                    height={20}
                    width={532}
                  ></Skeleton>
                </li>
                <li className="flex items-center text-sm">
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "0.25rem 0" }}
                    height={20}
                    width={532}
                  ></Skeleton>
                </li>
                <li className="flex items-center text-sm">
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "0.25rem 0" }}
                    height={20}
                    width={532}
                  ></Skeleton>
                </li>
              </ul>
              <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
                {[1, 2, 3].map((item) => {
                  return (
                    <li key={item} className={``}>
                      <Skeleton
                        variant="rounded"
                        sx={{ margin: "0.25rem 0" }}
                        height={40}
                        width={65}
                      ></Skeleton>
                    </li>
                  );
                })}
              </ul>
              <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Colors:</span>
                <Skeleton
                  variant="rounded"
                  sx={{ margin: "0.25rem 0" }}
                  height={40}
                  width={65}
                ></Skeleton>
                <Skeleton
                  variant="rounded"
                  sx={{ margin: "0.25rem 0" }}
                  height={40}
                  width={65}
                ></Skeleton>
              </ul>
              <div
                className={`flex items-center gap-2 py-4 border-b-[1px] border-border-color`}
              >
                <span className="text-md mr-2 min-w-[5rem]">Quantity:</span>
                <QuantityButton onClick={() => handleChangeQuantity(-1)}>
                  <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                </QuantityButton>
                <input
                  className="outline outline-1 outline-border-color w-10 py-1.5 text-center text-text-color focus:outline-primary-color"
                  value={qty}
                  min={1}
                  max={20}
                  required
                  type="text"
                  onChange={(e) =>
                    handleChangeQuantityByKeyBoard(+e.target.value)
                  }
                />
                <QuantityButton onClick={() => handleChangeQuantity(1)}>
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </QuantityButton>
                <span className="pl-6">
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "0.25rem 0" }}
                    height={30}
                    width={180}
                  ></Skeleton>
                </span>
              </div>

              <div className="pt-5 flex">
                <button
                  className="rounded-[4px] bg-primary-color text-white px-4 py-3 
                            font-medium flex justify-center items-center hover:bg-text-color
                            transition-all duration-200  text-ellipsis whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    className="pr-2 text-[20px]"
                    icon={faBagShopping}
                  ></FontAwesomeIcon>
                  Add to cart
                </button>
                <button
                  className="rounded-[4px] bg-primary-color text-white px-[15px] py-[11px] 
                            font-medium flex justify-center items-center hover:bg-text-color
                            transition-all duration-200 ml-6  text-ellipsis whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    className="pr-2 text-[20px]"
                    icon={faHeart}
                  ></FontAwesomeIcon>
                  Add to wishlist
                </button>
              </div>
            </div>
          </div>
          <div
            className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px] py-16`}
          >
            <ContentSwitcher description={""}></ContentSwitcher>
          </div>
          <div className="col-span-full grid place-items-center py-4">
            <CircularProgress />
          </div>
        </section>
      </>
    );
  if (isProductDetailError) {
    return <div>Fail to load product detail</div>;
  }
  const detail: Product = productDetail.result;
  const sizeList = size;
  const colorList = color;

  function handleSizeList(size: string) {
    let newSize: string[] = [];
    if (isSizeActive.includes(size)) {
      setSizeActive([]);
      return;
    }
    newSize.push(size);
    setSizeActive(newSize);
  }

  function handleColorList(color: string) {
    let newColor: string[] = [];
    if (isColorActive.includes(color)) {
      setColorActive([]);
      return;
    }
    newColor.push(color);
    setColorActive(newColor);
  }

  const handleClick = (event: any) => {
    event.target.select(); // Bôi đen toàn bộ giá trị khi click vào input
  };
  const handleChangeQuantity = (amount: number) => {
    if (amount === -1 && qty === 1 && !isNaN(amount)) {
      return;
    }
    if (isColorActive.length > 0 && isSizeActive.length > 0) {
      setQty((qty: number) => {
        const newQty = qty + amount;
        return MaxAmounts(newQty, productItem.quantity)
          ? newQty
          : productItem.quantity;
      });
      return;
    }
    setQty((qty: number) => {
      const newQty = qty + amount;
      return MaxAmounts(newQty, detail.totalQuantity)
        ? newQty
        : detail.totalQuantity;
    });
  };
  const handleChangeQuantityByKeyBoard = (qty: number) => {
    if (isNaN(qty)) {
      return;
    } else if (!qty) {
      setQty(0);
    }
    if (isColorActive.length > 0 && isSizeActive.length > 0) {
      setQty(
        MaxAmounts(qty, productItem.quantity) ? qty : productItem.quantity
      );
      return;
    }
    setQty(MaxAmounts(qty, detail.totalQuantity) ? qty : detail.totalQuantity);
  };

  const handleAddToCart = async (productItemId: number) => {
    if (isSizeActive.length > 0 && isColorActive.length > 0) {
      const payload = {
        productItemId,
        quantity: qty,
      };
      const id = toast.loading("Adding...");
      if (!getCookie("accessToken")) {
        try {
          // Lấy dữ liệu từ localStorage
          const storedCart = cart.getItem("cart", "local");

          let updatedCart = [];

          if (storedCart) {
            updatedCart = JSON.parse(storedCart);

            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingProductIndex = updatedCart.findIndex(
              (item: any) => item.productItem.productItemId === productItemId
            );

            if (existingProductIndex !== -1) {
              // Nếu sản phẩm đã tồn tại, tăng số lượng
              updatedCart[existingProductIndex].quantity += qty;
            } else {
              // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
              updatedCart.push({ productItem, quantity: qty });
            }
          } else {
            // Nếu giỏ hàng rỗng, thêm sản phẩm mới vào giỏ hàng
            updatedCart.push({ productItem, quantity: qty });
          }

          // Lưu giỏ hàng đã cập nhật vào localStorage
          cart.setItem("cart", JSON.stringify(updatedCart), "local");
          toast.update(id, {
            render: `Add To Cart Success`,
            type: "success",
            autoClose: 500,
            isLoading: false,
          });
          setSelected(false);
          resetProductItem();
          return;
        } catch (error: any) {
          toast.dismiss();
          return;
        }
      }
      const res = await addProductItemToCart(
        getCookie("accessToken")!,
        payload
      );
      if (res.success) {
        toast.update(id, {
          render: `Add To Cart Success`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        setSelected(false);
        resetProductItem();
        router.refresh();
      } else if (res.statusCode == 401) {
        toast.update(id, {
          render: `Please Login!`,
          type: "warning",
          autoClose: 500,
          isLoading: false,
        });
      } else {
        toast.update(id, {
          render: res.message,
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
      }
    } else setSelected(true);
  };

  return (
    <>
      <main className="font-montserrat bg-white mt-[76px] relative z-0">
        <section className="lg:container lg:border-y-[10px] border-white bg-background py-16 md:py-28 px-8">
          <div className={`grid grid-cols-1`}>
            <div className="flex items-center justify-center flex-col lg:flex-row lg:justify-between ">
              <span className="text-2xl leading-[30px] tracking-[1px] uppercase font-semibold text-text-color mb-[10px] lg:mb-0">
                {title}
              </span>
              <ul className="flex">
                {urlLink &&
                  urlLink?.map((value: string, index: number) => {
                    const nextLink = urlLink![index + 1];
                    let thisLink = null;
                    if (nextLink !== undefined && value !== "home") {
                      thisLink = (
                        <>
                          <Link
                            className="group-hover:cursor-pointer group-hover:text-secondary-color
                  transition-all duration-200 capitalize text-[18px]"
                            href={`/${value}`}
                          >
                            {value}
                          </Link>
                          <span className="px-[10px]">/</span>
                        </>
                      );
                    } else if (value === "home") {
                      thisLink = (
                        <>
                          <Link
                            className="group-hover:cursor-pointer group-hover:text-secondary-color
                  transition-all duration-200 capitalize text-[18px]"
                            href={`/`}
                          >
                            {value}
                          </Link>
                          <span className="px-[10px]">/</span>
                        </>
                      );
                    } else
                      thisLink = (
                        <span className="capitalize text-[18px]">{value}</span>
                      );
                    return (
                      <li
                        key={index}
                        className={`font-medium ${nextLink ? `group` : ``}`}
                      >
                        {thisLink}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <section className="container grid grid-cols-12 mt-8 md:mt-12 p-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
          <div className="col-span-full md:col-span-6 lg:col-span-5 lg:col-start-2 xl:col-span-4 xl:col-start-2 outline outline-1 outline-border-color h-fit">
            {showProductItem ? (
              <ImageMagnifier
                src={productItem.image}
                bgImg={productItem.image}
                height={480}
                zoomLevel={2.5}
              ></ImageMagnifier>
            ) : (
              <ImageMagnifier
                src={detail.image}
                bgImg={detail.image}
                height={480}
                zoomLevel={2.5}
              ></ImageMagnifier>
            )}
          </div>
          <div
            className={`col-span-full md:col-span-6 lg:col-span-5 xl:col-span-5`}
          >
            <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
              {detail && detail.name}
            </h3>
            {showProductItem ? (
              <h1 className="text-primary-color font-bold">
                {productItem && FormatPrice(productItem.price)} VNĐ
                {productItem &&
                  productItem.price != productItem.promotionalPrice && (
                    <span className="line-through text-text-light-color ml-2 text-sm">
                      {FormatPrice(productItem.promotionalPrice)} VNĐ
                    </span>
                  )}
              </h1>
            ) : (
              <h1 className="text-primary-color font-bold">
                {detail && FormatPrice(detail.promotionalPriceMin)} VNĐ
                {detail && detail.priceMin != detail.promotionalPriceMin && (
                  <span className="line-through text-text-light-color ml-2 text-sm">
                    {FormatPrice(detail.priceMin)} VNĐ
                  </span>
                )}
              </h1>
            )}
            <ul className=" border-b-[1px] border-border-color text-base py-4">
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Quality Assurance Policy</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Reasonable Pricing For Customer</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Fast and Convenient Delivery</p>
              </li>
            </ul>
            {sizeList && sizeList.length > 0 && (
              <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
                {sizeList.map((item: StyleValue) => {
                  return (
                    <div
                      onClick={() => {
                        handleSizeList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all
                              ${
                                isSizeActive.includes(item.name) &&
                                " bg-primary-color text-white"
                              }`}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </ul>
            )}
            {colorList && colorList.length > 0 && (
              <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Màu:</span>
                {colorList.map((item) => {
                  return (
                    <li
                      onClick={() => {
                        handleColorList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all
                              ${
                                isColorActive.includes(item.name)
                                  ? " bg-primary-color text-white"
                                  : ""
                              }`}
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            )}
            <div
              className={`flex items-center gap-2 py-4 border-b-[1px] border-border-color`}
            >
              <span className="text-md mr-2 min-w-[5rem]">Số lượng:</span>
              <QuantityButton onClick={() => handleChangeQuantity(-1)}>
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              </QuantityButton>
              <input
                onChange={(e) =>
                  handleChangeQuantityByKeyBoard(+e.target.value)
                }
                onFocus={handleClick}
                className="outline outline-1 outline-border-color w-10 py-1.5 text-center text-text-color focus:outline-primary-color"
                value={qty}
                required
                type="text"
              />
              <QuantityButton onClick={() => handleChangeQuantity(1)}>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
              </QuantityButton>
              {showProductItem ? (
                <span className="pl-6">
                  {productItem.quantity} products available
                </span>
              ) : (
                <span className="pl-6">
                  {detail.totalQuantity} products available
                </span>
              )}
            </div>
            {isSelected && (
              <p className="text-secondary-color text-lg p-2">
                Please Select Product Style
              </p>
            )}
            <div className="pt-5 flex">
              <button
                onClick={() => {
                  handleAddToCart(productItem.productItemId);
                }}
                className="rounded-[4px] bg-primary-color text-white px-4 py-3 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200  text-ellipsis whitespace-nowrap"
              >
                <FontAwesomeIcon
                  className="pr-2 text-[20px]"
                  icon={faBagShopping}
                ></FontAwesomeIcon>
                Add to cart
              </button>
              <Link href="/wishlist">
                <button
                  className="rounded-[4px] bg-primary-color text-white px-[15px] py-[11px] 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200 ml-6  text-ellipsis whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    className="pr-2 text-[20px]"
                    icon={faHeart}
                  ></FontAwesomeIcon>
                  Add to wishlist
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px] py-16`}
        >
          <ContentSwitcher description={detail.description}></ContentSwitcher>
        </div>
        {relatedProduct && relatedProduct.length > 0 && (
          <div
            className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px]`}
          >
            <RelatedProduct relatedProduct={relatedProduct}></RelatedProduct>
          </div>
        )}
      </section>
    </>
  );
};
export default ProductDetail;
