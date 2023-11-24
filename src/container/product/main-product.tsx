"use client";
import {
  faBagShopping,
  faClose,
  faHeart,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import { FormatPrice } from "@/features/product/FilterAmount";
import { imageLoader } from "@/features/img-loading";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Pagination from "@mui/material/Pagination";
import { Brand, Category, Product, StyleValue } from "@/features/types";
import usePath from "@/hooks/usePath";
import { diffInHours } from "@/features/product/date";
import Skeleton from "@mui/material/Skeleton";
import { CldImage } from "next-cloudinary";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { HTTP_PORT, getData } from "@/hooks/useData";

type MainProductProps = {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  styleValues?: StyleValue[];
};

type FilterValue = {
  brand: string;
  category: string;
  price: number[];
};
const MainProduct = (props: MainProductProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const thisPaths = usePath();
  const urlLink = thisPaths;
  const title = urlLink[0];
  const { categories, brands, products } = props;

  const [filterProductList, setFitlerProductList] = useState(products);
  const [filterValues, setFilterValues] = useState<FilterValue>({
    brand: "",
    category: "",
    price: [200000, 800000],
  });
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function resetFilter(event: { preventDefault: () => void }) {
    event.preventDefault();
    setFilterValues({
      brand: "",
      category: "",
      price: [200000, 800000],
    });
    setIsFiltering(false);
    setFitlerProductList(products);
    router.replace("/product");
  }

  function handlePriceList(event: Event, newValue: number | number[]) {
    setFilterValues({ ...filterValues, price: newValue as number[] });
  }

  function handleFilter(e: any) {
    const value = e.target.value;
    setFilterValues({
      ...filterValues,
      [e.target.name]: value,
    });
  }

  async function handleSearchByFilter(event: { preventDefault: () => void }) {
    event.preventDefault();

    const id = toast.loading("Searching...");

    const name = searchParams.get("name") || "";
    const categoryName = filterValues.category || "";
    const brandName = filterValues.brand || "";
    const price = filterValues.price || [0, 240000];
    try {
      const res = await getData(
        `${HTTP_PORT}/api/v1/products?productName=${name}&categoryName=${categoryName}&brandName=${brandName}&priceFrom=${price[0]}&priceTo=${price[1]}`
      );
      if (res.success) {
        toast.update(id, {
          render: `Found products`,
          type: "success",
          autoClose: 500,
          isLoading: false,
        });
        setIsFiltering(true);
        setFitlerProductList(res.result.content);
        setFilterValues({
          brand: "",
          category: "",
          price: [200000, 800000],
        });
      } else {
        toast.update(id, {
          render: `No Products Found`,
          type: "error",
          autoClose: 500,
          isLoading: false,
        });
        setIsFiltering(false);
        setFitlerProductList([]);
      }
    } catch (error) {
      toast.dismiss();
    }
  }

  const productList: Product[] = products;

  const brandList: Brand[] = brands;

  const categoryList: Category[] = categories;

  const priceMarks = [
    {
      value: 0,
      label: "0k",
    },
    {
      value: 2500000,
      label: "2500k",
    },
    {
      value: 5000000,
      label: "5000k",
    },
  ];

  return (
    <>
      <main className="font-montserrat bg-white mt-[6rem] relative z-0">
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
      <section className="container grid grid-cols-12 p-4 mt-8 md:mt-12">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
          <div className="col-span-full md:col-span-12 lg:col-span-3 grid gap-y-[30px] mb-5">
            <div className="bg-[#f5f5f5] p-3 shadow-md">
              <h2
                className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0] mb-5`}
              >
                FILTER BY
              </h2>
              <div className="flex gap-2 justify-center items-center">
                <Button
                  onClick={resetFilter}
                  sx={{
                    background: "#639df1",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.75rem",
                    marginBottom: "20px",
                    "&:hover": {
                      background: "#333",
                    },
                  }}
                  className="bg-primary-color py-2 px-4 w-fit rounded-md text-[0.75rem] transition-all 
                    duration-200  hover:bg-text-color cursor-pointer font-medium mb-5 text-white"
                >
                  <FontAwesomeIcon
                    className="mr-1"
                    icon={faClose}
                  ></FontAwesomeIcon>
                  <span className="capitalize">Reset</span>
                </Button>
                <Button
                  onClick={handleSearchByFilter}
                  sx={{
                    background: "#639df1",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.75rem",
                    marginBottom: "20px",
                    "&:hover": {
                      background: "#333",
                    },
                  }}
                  className="bg-primary-color py-2 px-4 w-fit rounded-md text-[0.75rem] transition-all 
                  duration-200  hover:bg-text-color cursor-pointer font-medium mb-5 text-white"
                >
                  <FontAwesomeIcon
                    className="mr-1"
                    icon={faSearch}
                  ></FontAwesomeIcon>
                  <span className="capitalize">Find</span>
                </Button>
              </div>
              <div>
                <h2 className="underline font-semibold text-text-color">
                  Price
                </h2>
                <ul className="text-text-color w-[90%] mx-auto">
                  <Slider
                    value={filterValues.price}
                    name="price"
                    min={0}
                    max={5000000}
                    step={50000}
                    marks={priceMarks}
                    onChange={handlePriceList}
                    valueLabelDisplay="auto"
                    getAriaValueText={FormatPrice}
                  />
                </ul>
              </div>
              <div>
                <h2 className="underline font-semibold text-text-color">
                  Brand
                </h2>
                <FormControl fullWidth>
                  <RadioGroup
                    name="brand"
                    value={filterValues.brand}
                    onChange={handleFilter}
                  >
                    {brandList &&
                      brandList.length &&
                      brandList.map((brand: Brand) => {
                        return (
                          <FormControlLabel
                            key={brand.brandId}
                            value={`${brand.name}`}
                            control={<Radio />}
                            label={`${brand.name}`}
                          />
                        );
                      })}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="bg-[#f5f5f5] p-3 shadow-md">
              <h2
                className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0]`}
              >
                CATEGORIES
              </h2>
              <FormControl>
                <RadioGroup
                  name="category"
                  value={filterValues.category}
                  onChange={handleFilter}
                >
                  {categoryList &&
                    categoryList.length &&
                    categoryList.map((category: Category) => {
                      return (
                        <FormControlLabel
                          key={category.categoryId}
                          value={`${category.name}`}
                          control={<Radio />}
                          label={`${category.name}`}
                        />
                      );
                    })}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <ul className="col-span-full md:col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-[30px] h-fit">
            {isFiltering && (
              <div
                className="col-span-full bg-[#f5f5f5] text-lg text-text-color py-4 rounded-sm flex items-center px-4
                shadow-md"
              >
                Result for the products :{filterProductList.length}
              </div>
            )}
            {filterProductList && filterProductList.length > 0 ? (
              filterProductList
                .slice(page - 1, page)
                .map((product: Product) => {
                  return (
                    <li
                      className={`group transition-all hover:cursor-pointer hover:shadow-sd col-span-1`}
                      key={product.productId}
                    >
                      <div className="relative outline outline-1 outline-border-color group-hover:outline-none">
                        {diffInHours(new Date(product.createdAt), new Date()) <=
                          72 && (
                          <label className="absolute top-3 left-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-primary-color">
                            New
                          </label>
                        )}
                        {product.priceMin != product.promotionalPriceMin && (
                          <label className="absolute top-3 right-3 px-1.5 py-0.5 text-[0.75rem] uppercase text-white bg-secondary-color">
                            Sale
                          </label>
                        )}
                        <Link href={`/product/${product.productId}`}>
                          {product.image ? (
                            <CldImage
                              loader={imageLoader}
                              priority
                              className="group-hover:shadow-sd"
                              alt="productImage"
                              src={product.image}
                              // crop="fill"
                              width={500}
                              height={500}
                              sizes="50vw"
                            ></CldImage>
                          ) : (
                            <Skeleton
                              sx={{
                                height: { sx: 225, md: 307 },
                                width: { sx: 225, md: 307 },
                              }}
                              animation="wave"
                              variant="rectangular"
                            />
                          )}
                        </Link>
                      </div>
                      <div className="relative w-full">
                        <div className="px-2 py-1">
                          <p
                            className="text-text-color text-base pt-[10px] overflow-hidden font-medium
                       text-ellipsis whitespace-nowrap "
                          >
                            {product.name}
                          </p>
                          <h3 className="text-primary-color font-bold text-ellipsis whitespace-nowrap">
                            {FormatPrice(product.promotionalPriceMin)} VNĐ
                            {product.priceMin !=
                              product.promotionalPriceMin && (
                              <span className="line-through text-text-light-color ml-2 text-sm">
                                {FormatPrice(product.priceMin)} VNĐ
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="absolute top-0 left-0 right-0 w-full h-full">
                          <ul
                            className="bg-[#f5f5f5] group-hover:flex group-hover:animate-appear 
                                        justify-center items-center h-full hidden"
                          >
                            <li
                              className="border-r border-[#c6c6c6]
                                        px-[10px] h-[20px]"
                            >
                              <div>
                                <Link href="/cart">
                                  <FontAwesomeIcon
                                    className="text-[20px] hover:text-primary-color transition-all"
                                    icon={faBagShopping}
                                  />
                                </Link>
                              </div>
                            </li>
                            <li className="px-[10px] h-[20px]">
                              <div>
                                <Link href="/wishlist">
                                  <FontAwesomeIcon
                                    className="text-[20px] hover:text-primary-color transition-all"
                                    icon={faHeart}
                                  />
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                })
            ) : (
              <div className="col-span-full text-center text-3xl p-4 text-secondary-color">
                No Products Found
              </div>
            )}
            {filterProductList.length > 0 && (
              <div className="col-span-full bg-background-color p-4 outline-none grid place-items-center">
                <Pagination
                  shape="rounded"
                  count={filterProductList.length}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  size="large"
                  color="primary"
                />
              </div>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default MainProduct;
