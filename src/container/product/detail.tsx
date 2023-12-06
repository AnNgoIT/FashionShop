"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { addProductItemToCart } from "@/hooks/useProducts";
import { Product, StyleValue, productItem } from "@/features/types";
import usePath from "@/hooks/usePath";
import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CartContext } from "@/store";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { getUserCart } from "@/hooks/useAuth";

type ProductDetailProps = {
  productId: string;
  color: StyleValue[];
  size: StyleValue[];
  productDetail: Product;
  relatedProduct: Product[];
  productItems: productItem[];
};

const ProductDetail = (props: ProductDetailProps) => {
  const { color, size, relatedProduct, productItems, productDetail } = props;
  const router = useRouter();

  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];

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
  const { cartItems, setCartItems } = useContext(CartContext);

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
    } else if (isColorActive.length > 0 || isSizeActive.length > 0) {
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
  }, [isColorActive, isSizeActive, productItems]);

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
        return MaxAmounts(newQty, productItem.quantity - productItem.sold)
          ? newQty
          : productItem.quantity - productItem.sold;
      });
      return;
    }
    setQty((qty: number) => {
      const newQty = qty + amount;
      return MaxAmounts(
        newQty,
        productDetail.totalQuantity - productDetail.totalSold
      )
        ? newQty
        : productDetail.totalQuantity - productDetail.totalSold;
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
        MaxAmounts(qty, productItem.quantity - productItem.sold)
          ? qty
          : productItem.quantity - productItem.sold
      );
      return;
    }
    setQty(
      MaxAmounts(qty, productDetail.totalQuantity - productDetail.totalSold)
        ? qty
        : productDetail.totalQuantity - productDetail.totalSold
    );
  };

  const handleAddToCart = async (
    event: { preventDefault: () => void },
    productItemId: number
  ) => {
    event.preventDefault();
    if (
      (productDetail.styleNames.length == 1 &&
        (isSizeActive.length > 0 || isColorActive.length > 0)) ||
      (productDetail.styleNames.length > 1 &&
        isSizeActive.length > 0 &&
        isColorActive.length > 0)
    ) {
      const payload = {
        productItemId: productItemId,
        quantity: qty,
      };
      if (hasCookie("accessToken")) {
        const res = await addProductItemToCart(
          getCookie("accessToken")!,
          payload
        );
        if (res.success) {
          successMessage("Thêm vào giỏ hàng thành công");
          setSelected(false);
          resetProductItem();
          const currCart = await getUserCart(getCookie("accessToken")!);
          if (currCart.success) {
            setCartItems(currCart.result.cartItems);
          }
          // router.refresh();
        } else if (res.response.data.statusCode === 401) {
          warningMessage("Cần đăng nhập để sử dụng chức năng này");
          router.push("/login");
          return;
        } else {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        }
      } else {
        warningMessage("Vui lòng đăng nhập");
        router.push("/login");
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
                src={productDetail.image}
                bgImg={productDetail.image}
                height={480}
                zoomLevel={2.5}
              ></ImageMagnifier>
            )}
          </div>
          <div
            className={`col-span-full md:col-span-6 lg:col-span-5 xl:col-span-5`}
          >
            <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
              {productDetail && productDetail.name}
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
                {productDetail &&
                  FormatPrice(productDetail.promotionalPriceMin)}{" "}
                VNĐ
                {productDetail &&
                  productDetail.priceMin !=
                    productDetail.promotionalPriceMin && (
                    <span className="line-through text-text-light-color ml-2 text-sm">
                      {FormatPrice(productDetail.priceMin)} VNĐ
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
                <p className="leading-7">Chính sách bảo hành chật lượng</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Giá cả ưu đãi cho khách hàng</p>
              </li>
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Vận chuyển nhanh chóng và tiện lợi</p>
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
                  {productItem.quantity - productItem.sold} sản phẩm có sẵn
                </span>
              ) : (
                <span className="pl-6">
                  {productDetail.totalQuantity - productDetail.totalSold} sản
                  phẩm có sẵn
                </span>
              )}
            </div>
            {isSelected && (
              <p className="text-secondary-color text-lg p-2">
                Vui lòng chọn phân loại sản phẩm
              </p>
            )}
            <div className="pt-5 flex">
              <button
                onClick={(e) => {
                  handleAddToCart(e, productItem.productItemId);
                }}
                className="rounded-[4px] bg-primary-color text-white px-4 py-3 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200  text-ellipsis whitespace-nowrap"
              >
                <FontAwesomeIcon
                  className="pr-2 text-[20px]"
                  icon={faBagShopping}
                ></FontAwesomeIcon>
                Thêm vào giỏ hàng
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
                  Theo dõi sản phẩm
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px] py-16`}
        >
          <ContentSwitcher
            description={productDetail.description}
          ></ContentSwitcher>
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
