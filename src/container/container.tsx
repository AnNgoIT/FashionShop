"use client";
import React, { Suspense, useEffect } from "react";
import Banner from "./banner";
import Blogs from "./blogs";
import Products from "./products";
import Services from "./services";
import SubBanner from "./sub-banner";
import CategorySection from "./category";
import { Category, Product } from "@/features/types";
import StoreAddress from "./store-address";
import Newsletter from "./newsletter";
import { hasCookie, deleteCookie } from "cookies-next";
import dynamic from "next/dynamic";
import LoadingComponent from "@/components/loading";

// const CategorySection = dynamic(() => import("./category"));
// const Products = dynamic(() => import("./products"), { ssr: false });
// const Products = dynamic(() => import("./products"), { ssr: false });
const Container = ({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) => {
  useEffect(() => {
    return () => {
      if (hasCookie("isPayment")) deleteCookie("isPayment");
    };
  }, []);
  return (
    <>
      <Banner />
      <SubBanner />
      <Services />
      <CategorySection categories={categories} />
      <Products products={products} />
      <Blogs />
      <StoreAddress />
      <Newsletter />
    </>
  );
};

export default Container;
