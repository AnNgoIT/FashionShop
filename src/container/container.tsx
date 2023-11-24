"use client";
import React from "react";
import Banner from "./banner";
import Blogs from "./blogs";
import Products from "./products";
import Services from "./services";
import SubBanner from "./sub-banner";

const Container = () => {
  return (
    <>
      <Banner />
      <SubBanner />
      <Services />
      <Products />
      <Blogs />
    </>
  );
};

export default Container;
