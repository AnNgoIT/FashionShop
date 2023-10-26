"use client";
import React, { useState } from "react";
// import { useRouter } from 'next/navigation'
import usePath from "@/hooks/usePath";
import Image from "next/image";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCheck,
  faHeart,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
// import ContentSwitcher from "@/containers/ProductDetail/ContentSwitcher";
// import RelatedProduct from "@/containers/ProductDetail/RelatedProduct";
// import { montserrat } from "@/variables/Variable";
// import { FormatPrice } from "@/containers/HomePage/Product";
import {
  FormatPrice,
  MaxAmounts,
  onlyNumbers,
} from "@/features/product/FilterAmount";
import { ProductDetail } from "@/features/product";
import { product_1 } from "@/assests/images";
import { imageLoader } from "@/features/img-loading";
import Button from "@mui/material/Button";
import { QuantityButton } from "@/components/button";
import RelatedProduct from "@/container/related-product";

const ProductDetailPage = () => {
  const [qty, setQty] = useState(1);

  // const router = useRouter();
  // const query = router.query;
  const thisPaths = usePath();

  const handleClick = (event: any) => {
    event.target.select(); // Bôi đen toàn bộ giá trị khi click vào input
  };
  const handleChangeQuantity = (amount: number) => {
    if (amount === -1 && qty === 1 && !isNaN(amount)) {
      return;
    }
    setQty((qty: number) => {
      const newQty = qty + amount;
      return MaxAmounts(newQty, 20) ? newQty : 20;
    });
  };
  const handleChangeQuantityByKeyBoard = (qty: number) => {
    if (isNaN(qty)) {
      return;
    } else if (!qty) {
      setQty(0);
    }
    setQty(MaxAmounts(qty, 20) ? qty : 20);
  };

  return (
    <section className="container grid grid-cols-12 mt-8 md:mt-12 p-4">
      <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-7 gap-y-4">
        <div className="col-span-full md:col-span-5 lg:col-span-4 lg:col-start-2 outline outline-1 outline-border-color h-fit">
          <Image
            loader={imageLoader}
            placeholder="blur"
            className="w-full"
            alt="productDetailImage"
            src={product_1}
            width={500}
            height={0}
          ></Image>
        </div>
        <div className={`col-span-full md:col-span-7 lg:col-span-5`}>
          <h3 className="pb-1 text-[1.5rem] leading-7 font-semibold text-text-color">
            Product
          </h3>
          <h1 className="text-primary-color font-bold">
            {FormatPrice(380000)} VNĐ
            <span className="line-through text-text-light-color ml-2 text-sm">
              {FormatPrice(420000)} VNĐ
            </span>
          </h1>
          <div className="text-[1.5rem] ">
            {[1, 2, 3, 4, 5].map((value) => {
              return <span key={value}>★</span>;
            })}
          </div>
          <ul className=" border-b-[1px] border-border-color text-base py-4">
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
              <p className="leading-7">Giá cả hợp lý</p>
            </li>
            <li className="flex items-center text-sm">
              <FontAwesomeIcon
                className="text-primary-color pr-1"
                icon={faCheck}
              />
              <p className="leading-7">Giao hàng nhanh chóng tiện lợi</p>
            </li>
          </ul>
          <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
            <span className="text-md mr-2 min-w-[5rem]">Sizes:</span>
            <li className="outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all">
              S
            </li>
            <li className="outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all">
              L
            </li>
            <li className="outline outline-1 outline-border-color px-4 py-2 cursor-pointer hover:bg-primary-color hover:text-white transition-all">
              XL
            </li>
          </ul>
          <ul className="flex items-center gap-2 py-4 border-b-[1px] border-border-color text-base">
            <span className="text-md mr-2 min-w-[5rem]">Colors:</span>
            <li className="p-5 outline outline-1 outline-border-color cursor-pointer bg-primary-color"></li>
            <li className="p-5 outline outline-1 outline-border-color cursor-pointer bg-secondary-color"></li>
            <li className="p-5 outline outline-1 outline-border-color cursor-pointer bg-text-light-color"></li>
          </ul>
          <div
            className={`flex items-center gap-2 py-4 border-b-[1px] border-border-color`}
          >
            <span className="text-md mr-2 min-w-[5rem]">Quantity:</span>
            <QuantityButton onClick={() => handleChangeQuantity(-1)}>
              <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
            </QuantityButton>
            <input
              onChange={(e) => handleChangeQuantityByKeyBoard(+e.target.value)}
              onFocus={handleClick}
              className="outline outline-1 outline-border-color w-10 py-1.5 text-center text-text-color focus:outline-primary-color"
              value={qty}
              min={1}
              max={20}
              required
              type="text"
            />
            <QuantityButton onClick={() => handleChangeQuantity(1)}>
              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </QuantityButton>
            <span className="pl-6">{20} products available</span>
          </div>

          <div className="pt-5 flex">
            <Link href="/cart">
              {/* onClick ={" "}
                  {() => {
                    handleAddToCart(item.id);
                  }} */}
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
            </Link>
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
      {/* <div
          className={`grid grid-cols-12 max-[500px]:px-[15px] gap-x-[30px] banner-part`}
        >
          <ContentSwitcher
            description={productdetail.description}
          ></ContentSwitcher>
        </div>*/}
      <div className={`col-span-full grid grid-cols-12 gap-x-[30px]`}>
        <RelatedProduct categoryId={1}></RelatedProduct>
      </div>
    </section>
  );
};

// export const getStaticParams = async () => {
//   const res = await axios.get("http://localhost:8080/products");
//   const products = res && res.data ? res.data : {};
//   // Get the paths we want to pre-render based on products
//   const paths = products.map((product: any) => ({
//     params: { id: product.id.toString() },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false };
// };
export default ProductDetailPage;
