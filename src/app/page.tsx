"use client";
import dynamic from "next/dynamic";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Container = dynamic(() => import("@/container/container"));
const Home = () => {
  return <Container></Container>;
};
export default Home;
