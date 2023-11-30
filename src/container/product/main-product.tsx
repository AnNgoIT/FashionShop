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
import { imageLoader, theme } from "@/features/img-loading";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import { ThemeProvider, styled } from "@mui/material/styles";
import { sale_banner2 } from "@/assests/images";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Image from "next/image";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "white",
    fontSize: 16,
    // transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    // "&:focus": {
    //   borderRadius: 4,
    //   borderColor: "#80bdff",
    //   boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    // },
  },
}));

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
  const [sortPrice, setSortPrice] = useState<string>("Giá");
  const [isActive, setIsActive] = useState<string>("Phổ biến");
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [page, setPage] = useState(1);

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function handleSortPrice(e: any) {
    const value = e.target.value;
    setSortPrice(value);
    let sortProductList: Product[] = [];
    if (value == "Giá thấp nhất") {
      sortProductList = [...filterProductList].sort(
        (a, b) => a.priceMin - b.priceMin
      );
      setFitlerProductList(sortProductList);
    } else if (value == "Giá cao nhất") {
      sortProductList = [...filterProductList].sort(
        (a, b) => b.priceMin - a.priceMin
      );
      setFitlerProductList(sortProductList);
    } else {
      sortProductList = isFiltering ? filterProductList : products;
    }
    setFitlerProductList(sortProductList);
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
    setIsActive("Phổ biến");
    setSortPrice("Giá");
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

  function handleSort(value: string) {
    setIsActive(value);
    if (products) {
      let sortProductList: Product[] = [];
      if (value == "Mới nhất") {
        sortProductList = [...filterProductList].sort(
          (a, b) => b.productId - a.productId
        );
      } else if (value == "Bán chạy") {
        sortProductList = [...filterProductList].sort(
          (a, b) => b.totalSold - a.totalSold
        );
      } else {
        sortProductList = isFiltering ? filterProductList : products;
      }
      setFitlerProductList(sortProductList);
    }
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
      }
    } catch (error: any) {
      toast.update(id, {
        render: `No Products Found`,
        type: "error",
        autoClose: 500,
        isLoading: false,
      });
      setIsFiltering(false);
      setFitlerProductList([]);
    }
  }

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
      <section className="container grid grid-cols-12 max-md:px-4">
        <div className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-[30px]">
          <div className="col-span-full my-10 h-max">
            <Box
              sx={{
                maxHeight: {
                  xs: 180,
                  sm: 350,
                  md: 450,
                  lg: 550,
                },
                height: 250,
                width: ["100%", "100%"],
              }}
            >
              <Image
                loader={imageLoader}
                src={sale_banner2}
                alt="saleBanner2"
                placeholder="blur"
                className="w-full h-full rounded-lg"
                width={400}
                height={0}
              />
            </Box>
          </div>
          <div className="col-span-full md:col-span-12 lg:col-span-3 grid gap-y-[30px] mb-5">
            <div className="bg-[#f5f5f5] p-3 shadow-md">
              <div className="flex gap-x-1 items-center border-b-2 border-text-light-color py-2">
                <FilterAltIcon sx={{ fontSize: "2rem" }} />
                <h2
                  className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0]`}
                >
                  Lọc theo
                </h2>
              </div>

              <div className="flex gap-2 justify-center items-center py-2 mb-5">
                <Button
                  onClick={resetFilter}
                  sx={{
                    background: "#639df1",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.75rem",
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
                  <span className="capitalize">Làm mới</span>
                </Button>
                <Button
                  onClick={handleSearchByFilter}
                  sx={{
                    background: "#639df1",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.75rem",
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
                  <span className="capitalize">Tìm kiếm</span>
                </Button>
              </div>
              <div>
                <h2 className="font-semibold text-text-color ">Giá</h2>
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
                <h2 className="font-semibold text-text-color">Thương hiệu</h2>
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
              <div className="flex gap-x-1 items-center border-b-2 border-text-light-color py-2">
                <MenuIcon sx={{ fontSize: "2rem" }} />
                <h2
                  className={`text-text-color font-medium text-[18px] leading-[32px] tracking-[0]`}
                >
                  Danh mục sản phẩm
                </h2>
              </div>
              {categoryList &&
                categoryList.length > 0 &&
                categoryList
                  .filter((cate) => cate.parentName == null)
                  .map((category: Category) => {
                    return (
                      <Accordion
                        key={category.categoryId}
                        sx={{ background: "#f3f3f3", boxShadow: "none" }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="category-content"
                          id="category-header"
                        >
                          <Typography>{category.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: "0 0.5rem" }}>
                          <div className="py-0 px-6">
                            <FormControl fullWidth>
                              <RadioGroup
                                name="category"
                                value={filterValues.category}
                                onChange={handleFilter}
                              >
                                {categoryList
                                  .filter(
                                    (cate) => cate.parentName == category.name
                                  )
                                  .map((category: Category) => {
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
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
            </div>
          </div>
          <ul className="col-span-full md:col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-[30px] h-fit">
            <div
              className="col-span-full bg-[#f5f5f5] text-base text-text-color py-4 rounded-sm flex items-center px-4
                shadow-md"
            >
              <span className="hidden md:block">Sắp xếp theo</span>
              <div className="ml-2 flex gap-x-2">
                <button
                  onClick={() => handleSort("Phổ biến")}
                  className={`${
                    isActive === "Phổ biến"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Phổ biến
                </button>
                <button
                  onClick={() => handleSort("Mới nhất")}
                  className={`${
                    isActive === "Mới nhất"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Mới nhất
                </button>
                <button
                  onClick={() => handleSort("Bán chạy")}
                  className={`${
                    isActive === "Bán chạy"
                      ? "bg-primary-color text-white"
                      : "bg-white hover:bg-primary-color hover:text-white hover:cursor-pointer "
                  } px-4 py-2 text-base text-text-color transition-all rounded-sm truncate`}
                >
                  Bán chạy
                </button>
                <ThemeProvider theme={theme}>
                  <FormControl
                    sx={{
                      width: ["6rem", "9.5rem"],
                      background: "white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    // variant="standard"
                  >
                    <Select
                      id="sort-id"
                      name="price"
                      value={sortPrice}
                      onChange={handleSortPrice}
                      input={<BootstrapInput />}
                    >
                      <MenuItem value={"Giá"}>Giá</MenuItem>
                      <MenuItem value={"Giá thấp nhất"}>Giá thấp nhất</MenuItem>
                      <MenuItem value={"Giá cao nhất"}>Giá cao nhất</MenuItem>
                    </Select>
                  </FormControl>
                </ThemeProvider>
              </div>
            </div>
            {isFiltering && (
              <div
                className="col-span-full bg-[#f5f5f5] text-lg text-text-color py-4 rounded-sm flex items-center px-4
                shadow-md"
              >
                Result for the products : {filterProductList.length}
              </div>
            )}
            {filterProductList && filterProductList.length > 0 ? (
              filterProductList
                .slice(page - 1, page + 4)
                .map((product: Product) => {
                  return (
                    <li
                      className={`group transition-all hover:cursor-pointer hover:shadow-sd col-span-1`}
                      key={product.productId}
                    >
                      <div className="relative outline outline-1 outline-border-color group-hover:outline-none">
                        {diffInHours(
                          new Date(product.createdAt!),
                          new Date()
                        ) <= 72 && (
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
                  count={Math.max(
                    Math.ceil(filterProductList.length / 5),
                    1 // Đảm bảo rằng count ít nhất là 1 nếu không có sản phẩm nào
                  )}
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
