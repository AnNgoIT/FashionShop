"use client";
import React from "react";
import Banner from "./banner";
import Blogs from "./blogs";
import Products from "./products";
import Services from "./services";
import SubBanner from "./sub-banner";
import CategorySection from "./category";
import { Category } from "@/features/types";
import StoreAddress from "./store-address";
import Newsletter from "./newsletter";

const Container = ({ categories }: { categories: Category[] }) => {
  return (
    <>
      <Banner />
      <SubBanner />
      <Services />
      <CategorySection categories={categories} />
      <Products />
      <Blogs />
      <StoreAddress />
      <Newsletter />
    </>
  );
};

export default Container;
