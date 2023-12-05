"use client";
import React from "react";
import Banner from "./banner";
import Blogs from "./blogs";
import Products from "./products";
import Services from "./services";
import SubBanner from "./sub-banner";
import CategorySection from "./category";
import { Category, Product } from "@/features/types";
import StoreAddress from "./store-address";
import Newsletter from "./newsletter";

const Container = ({ categories,products }: { categories: Category[],products:Product[] }) => {
  return (
    <>
      <Banner />
      <SubBanner />
      <Services />
      <CategorySection categories={categories} />
      <Products products={products}/>
      <Blogs />
      <StoreAddress />
      <Newsletter />
    </>
  );
};

export default Container;
