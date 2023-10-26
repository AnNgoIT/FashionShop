import React from "react";
import dynamic from "next/dynamic";

const Banner = dynamic(() => import("@/container/banner"));
const SubBanner = dynamic(() => import("./sub-banner"));
const Services = dynamic(() => import("./services"));
const Products = dynamic(() => import("./products"));
const Blogs = dynamic(() => import("./blogs"));

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
