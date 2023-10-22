import Banner from "@/container/banner";
import React from "react";
import SubBanner from "./sub-banner";
import Services from "./services";
import Products from "./products";
import Blogs from "./blogs";

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
