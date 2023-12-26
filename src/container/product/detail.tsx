"use client";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCheck,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { FormatPrice, MaxAmounts } from "@/features/product/FilterAmount";
import { QuantityButton } from "@/components/button";

import ImageMagnifier from "@/components/image-magnifier";
import { addProductItemToCart } from "@/hooks/useProducts";
import { Product, RatingType, StyleValue, productItem } from "@/features/types";
import usePath from "@/hooks/usePath";
import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { CartContext, UserContext } from "@/store";
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "@/features/toasting";
import { followProduct, getUserCart } from "@/hooks/useAuth";
import Carousel from "react-multi-carousel";
import { defaulResponsive3, imageLoader } from "@/features/img-loading";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";
type ProductDetailProps = {
  color: StyleValue[];
  size: StyleValue[];
  rating: RatingType[];
  relatedProduct: Product[];
  productItems: productItem[];
  productDetail: Product;
  follows: number;
};

import Rating from "@mui/material/Rating";
import { getUniqueProductItems } from "@/features/product";
import dynamic from "next/dynamic";
// import ViewedProducts from "./viewed-products";
import Review from "./review";
import DetailContent from "./detail-content";
import { getAuthenticated } from "@/hooks/useData";

// const DetailContent = dynamic(
//   () => import("@/container/product/detail-content"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="col-span-full grid place-items-center">
//         <CircularProgress />
//       </div>
//     ),
//   }
// );
const RelatedProduct = dynamic(
  () => import("@/container/product/related-product"),
  {
    ssr: false,
  }
);

const ViewedProducts = dynamic(() => import("./viewed-products"), {
  ssr: false,
  // loading: () => <RelatedProductLoading title={"Sản phẩm đã xem"} />,
});

const ProductDetail = (props: ProductDetailProps) => {
  const {
    color,
    size,
    rating,
    relatedProduct,
    productItems,
    productDetail,
    follows,
  } = props;

  const router = useRouter();

  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];

  const [qty, setQty] = useState<number>(1);

  const [isSizeActive, setSizeActive] = useState<string[]>([]);
  const [isColorActive, setColorActive] = useState<string[]>([]);
  const [isSelected, setSelected] = useState<boolean>(false);
  const [showProductItem, setShowProductItem] = useState(false);
  const [likeValue, setLikeValue] = useState<number>(follows);
  const [checkFollow, setCheckFollow] = useState<boolean>(false);
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
  const { user } = useContext(UserContext);
  const { setCartItems } = useContext(CartContext);

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
      return;
    } else if (isColorActive.length > 0 || isSizeActive.length > 0) {
      const newProductItem = productItems.find((productItem) =>
        productItem.styleValueNames.includes(isColorActive[0])
      );
      if (newProductItem) {
        setProductItem(newProductItem);
        setShowProductItem(true); // Khi đã tìm thấy sản phẩm phù hợp, hiển thị ảnh mới
      }
      return;
    } else {
      setShowProductItem(false); // Nếu không có size hoặc color active, ẩn ảnh
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isColorActive, isSizeActive, productItems]);

  useEffect(() => {
    // Lấy danh sách sản phẩm đã xem từ local storage
    const viewedProductsJSON = localStorage.getItem("viewedProducts");
    const currViewedProducts = viewedProductsJSON
      ? JSON.parse(viewedProductsJSON)
      : [];

    // Kiểm tra xem sản phẩm hiện tại đã tồn tại trong danh sách đã xem chưa
    const viewedProductExisted = currViewedProducts.find(
      (product: Product) => product.productId === productDetail.productId
    );

    // Nếu sản phẩm chưa tồn tại, thêm nó vào danh sách đã xem và lưu vào local storage
    if (!viewedProductExisted && hasCookie("accessToken")) {
      const updatedViewedProducts = [...currViewedProducts, productDetail];
      localStorage.setItem(
        "viewedProducts",
        JSON.stringify(updatedViewedProducts)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetail]); // Thêm productDetail vào dependency array để useEffect chạy khi productDetail thay đổi

  useEffect(() => {
    async function checkUserFollow() {
      if (user.email !== "") {
        try {
          const checkFollow = await getAuthenticated(
            `/api/v1/users/customers/products/check-follow/${productDetail.productId}`,
            getCookie("accessToken")!
          );
          if (checkFollow.success) {
            setCheckFollow(checkFollow.result);
          } else {
            setCheckFollow(false);
            router.refresh();
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    checkUserFollow();
  }, [user.email, follows, productDetail.productId, router]);

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
    } else if (!qty || qty < 1) {
      qty = 1;
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

  let isAddingToCart = false; // Biến cờ để kiểm tra xem có đang xử lý hay không

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
      if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
        warningMessage("Đang tạo lại phiên đăng nhập mới");
        router.refresh();
        return;
      } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
        warningMessage("Vui lòng đăng nhập để thêm vào giỏ hàng");
        router.push("/login");
        router.refresh();
        return;
      }
      if (isAddingToCart) return; // Nếu đang xử lý, không cho phép gọi API mới
      isAddingToCart = true; // Đánh dấu đang xử lý

      try {
        const res = await addProductItemToCart(
          getCookie("accessToken") || "",
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
        } else if (res.statusCode === 401) {
          if (hasCookie("refreshToken")) {
            warningMessage("Đang tạo lại phiên đăng nhập mới");
            router.refresh();
          } else {
            warningMessage("Cần đăng nhập để sử dụng chức năng này");
            router.push("/login");
          }
        } else if (res.status == 400) {
          warningMessage("Số lượng phải lớn hơn 0");
          resetProductItem();
        } else if (res.status == 500) {
          //   warningMessage("Lỗi hệ thống");
          //   router.refresh();
        }
      } catch (e) {
        console.log(e);
      } finally {
        isAddingToCart = false;
      }
    } else setSelected(true);
  };

  let isCheckouting = false; // Biến cờ để kiểm tra xem có đang xử lý hay không

  const handleCheckout = async (e: any, productItem: productItem) => {
    e.preventDefault();
    if (
      (productDetail.styleNames.length == 1 &&
        (isSizeActive.length > 0 || isColorActive.length > 0)) ||
      (productDetail.styleNames.length > 1 &&
        isSizeActive.length > 0 &&
        isColorActive.length > 0)
    ) {
      if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
        warningMessage("Đang tạo lại phiên đăng nhập mới");
        router.refresh();
        return;
      } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
        warningMessage("Vui lòng đăng nhập để thêm vào giỏ hàng");
        router.push("/login");
        router.refresh();
        return;
      }
      if (isCheckouting) return; // Nếu đang xử lý, không cho phép gọi API mới
      isCheckouting = true; // Đánh dấu đang xử lý
      const payload = {
        productItemId: productItem.productItemId,
        quantity: qty,
      };
      try {
        const res = await addProductItemToCart(
          getCookie("accessToken")!,
          payload
        );
        if (res.success) {
          setSelected(false);
          resetProductItem();
          const currCart = await getUserCart(getCookie("accessToken")!);
          if (currCart.success) {
            if (currCart.result.cartItems.length >= 1) {
              setCartItems([currCart.result.cartItems.at(-1)]);
            } else setCartItems([]);
            router.push("/cart/checkout");
          }
          // router.refresh();
        } else if (res.statusCode === 401) {
          if (hasCookie("refreshToken")) {
            router.refresh();
          } else {
            warningMessage("Cần đăng nhập để sử dụng chức năng này");
            router.push("/login");
          }
        } else {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        }
      } catch (e) {
        console.error(e);
      } finally {
        isCheckouting = false;
      }
    } else setSelected(true);
  };

  const handleFollowProduct = async (newValue: number) => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để yêu thích sản phẩm này");
      router.push("/login");
      router.refresh();
      return;
    }
    try {
      setLikeValue(newValue);
      setCheckFollow(!checkFollow);
      if (!checkFollow) {
        const followingProduct = await followProduct(
          `/api/v1/users/customers/products/follow-product/${productDetail.productId}`,
          getCookie("accessToken")!
        );
        if (followingProduct.success) {
          router.refresh();
        } else if (followingProduct.statusCode == 401) {
          warningMessage("Hết phiên đăng nhập, đang tạo phiên mới");
          router.refresh();
        } else if (followingProduct.status == 500) {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        } else if (followingProduct.statusCode == 400) {
          errorMessage("Gặp vấn đề dữ liệu khi theo dõi sản phẩm");
        }
      } else {
        const unFollowingProduct = await followProduct(
          `/api/v1/users/customers/products/unfollow-product/${productDetail.productId}`,
          getCookie("accessToken")!
        );
        if (unFollowingProduct.success) {
          router.refresh();
        } else if (unFollowingProduct.statusCode == 401) {
          warningMessage("Hết phiên đăng nhập, đang tạo phiên mới");
          router.refresh();
        } else if (unFollowingProduct.status == 500) {
          errorMessage("Lỗi hệ thống");
          router.refresh();
        } else if (unFollowingProduct.statusCode == 400) {
          errorMessage("Gặp vấn đề dữ liệu khi theo dõi sản phẩm");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main className="font-montserrat bg-white mt-[76px] md:mt-[80px] lg:mt-[96px] relative z-0">
        <section className="lg:container border-white bg-background px-8 py-4 rounded-md max-md:rounded-none">
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
      <section className="container grid grid-cols-12 mt-8 md:mt-12 max-lg:px-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
          <div className="col-span-full md:col-span-5 lg:col-span-4 lg:col-start-2 h-fit">
            {showProductItem ? (
              <ImageMagnifier
                src={productItem.image}
                bgImg={productItem.image}
                height={400}
                zoomLevel={2.5}
              ></ImageMagnifier>
            ) : (
              <ImageMagnifier
                src={productDetail.image}
                bgImg={productDetail.image}
                height={400}
                zoomLevel={2.5}
              ></ImageMagnifier>
            )}
            {getUniqueProductItems(productItems).length >= 3 && (
              <div className="mt-4">
                <Carousel
                  swipeable={true}
                  draggable={false}
                  ssr={true}
                  responsive={defaulResponsive3}
                  autoPlay={true}
                  infinite={true}
                  autoPlaySpeed={3000}
                  keyBoardControl={true}
                  transitionDuration={500}
                  arrows={false}
                  deviceType={"desktop"}
                  // itemClass="carousel-item"
                >
                  {productItems &&
                    productItems.length > 0 &&
                    getUniqueProductItems(productItems).map(
                      (productItem: productItem) => {
                        return (
                          <div
                            className={`group`}
                            key={productItem.productItemId}
                          >
                            <div className="relative grid place-items-center">
                              <Image
                                className="w-[98%] h-[98%] p-0.5 border-2 border-primary-color"
                                loader={imageLoader}
                                blurDataURL={productItem.image}
                                placeholder="blur"
                                alt="productItemImage"
                                src={productItem.image}
                                width={180}
                                height={120}
                              ></Image>
                            </div>
                          </div>
                        );
                      }
                    )}
                </Carousel>
              </div>
            )}
          </div>
          <div className={`col-span-full md:col-span-7 lg:col-span-5`}>
            <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
              {productDetail && productDetail.name}
            </h3>
            <div className="flex gap-x-4 py-2 text-base font-semibold items-center">
              {productDetail.rating > 0 && (
                <div className="flex items-center gap-x-2">
                  <Rating
                    precision={0.1}
                    name="read-only"
                    value={productDetail.rating}
                    readOnly
                  />{" "}
                  <p className="border-r border-border-color pr-2">
                    {" "}
                    {`(${productDetail.rating} sao)`}
                  </p>
                </div>
              )}
              <span className="">
                Đã bán {productDetail.totalSold} sản phẩm
              </span>
              {user.email == "" && (
                <div className="flex gap-x-2 items-center">
                  <FavoriteBorderIcon
                    sx={{
                      fontSize: "24px",
                      color: "#ccc",
                    }}
                  />{" "}
                  <p>Đã yêu thích ({likeValue})</p>
                </div>
              )}
              {user.email !== "" && !checkFollow ? (
                <div className="flex gap-x-2 items-center">
                  <FavoriteBorderIcon
                    onClick={() => handleFollowProduct(likeValue + 1)}
                    sx={{ fontSize: "24px", cursor: "pointer", color: "#ccc" }}
                  />
                  <p>Đã yêu thích ({likeValue})</p>
                </div>
              ) : (
                user.email !== "" &&
                checkFollow && (
                  <div className="flex gap-x-2 items-center">
                    <FavoriteIcon
                      onClick={() => handleFollowProduct(likeValue - 1)}
                      sx={{
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#ff6d75",
                      }}
                    />{" "}
                    <p>Đã yêu thích ({likeValue})</p>
                  </div>
                )
              )}
            </div>
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
            <ul className=" border-b border-border-color text-base py-4">
              <li className="flex items-center text-sm">
                <FontAwesomeIcon
                  className="text-primary-color pr-1"
                  icon={faCheck}
                />
                <p className="leading-7">Chính sách bảo hành chất lượng</p>
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
            {size && size.length > 0 && (
              <ul className="flex items-center gap-2 py-4 border-b border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Kích cỡ:</span>
                {size.map((item: StyleValue) => {
                  return (
                    <div
                      onClick={() => {
                        handleSizeList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all truncate
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
            {color && color.length > 0 && (
              <ul className="flex items-center gap-2 py-4 border-b border-border-color text-base">
                <span className="text-md mr-2 min-w-[5rem]">Màu:</span>
                {color.map((item) => {
                  return (
                    <li
                      onClick={() => {
                        handleColorList(item.name);
                        // increasePriceBySize(item.price);
                      }}
                      key={item.styleValueId}
                      className={`outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all truncate
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
              className={`flex items-center gap-2 py-4 border-b border-border-color`}
            >
              <span className="text-md mr-2 min-w-[5rem]">Số lượng:</span>
              <QuantityButton onClick={() => handleChangeQuantity(-1)}>
                <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
              </QuantityButton>
              <input
                onChange={(e) =>
                  handleChangeQuantityByKeyBoard(
                    +e.target.value == 0 ? 1 : +e.target.value
                  )
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
              <button
                onClick={(e) => {
                  handleCheckout(e, productItem);
                }}
                className="rounded-[4px] bg-primary-color text-white px-[15px] py-[11px] 
                                  font-medium flex justify-center items-center hover:bg-text-color
                                  transition-all duration-200 ml-6  text-ellipsis whitespace-nowrap"
              >
                <FontAwesomeIcon
                  className="pr-2 text-[20px]"
                  icon={faCheck}
                ></FontAwesomeIcon>
                Mua hàng ngay
              </button>
            </div>
          </div>
        </div>
        <div
          className={`col-span-full lg:col-span-10 lg:col-start-2 grid grid-cols-12 gap-x-[30px] py-8`}
        >
          <DetailContent
            description={"Mô tả"}
            content={
              <p className="text-[#999] text-base">
                {productDetail.description}
              </p>
            }
          ></DetailContent>
        </div>

        <div
          className={`col-span-full lg:col-span-10 lg:col-start-2 grid grid-cols-12 gap-x-[30px] pb-8`}
        >
          <div className="shadow-[0_0_20px_rgba(0,0,0,0.1)] col-span-full">
            <DetailContent
              description={"Đánh giá"}
              content={<Review rating={rating} />}
            ></DetailContent>
          </div>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px]`}
        >
          <RelatedProduct relatedProduct={relatedProduct}></RelatedProduct>
        </div>
        <div
          className={`col-span-full md:col-span-10 md:col-start-2 grid grid-cols-12 gap-x-[30px]`}
        >
          <ViewedProducts />
        </div>
      </section>
    </>
  );
};
export default ProductDetail;
