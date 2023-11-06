"use client";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import dynamic from "next/dynamic";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Container = dynamic(() => import("@/container/container"));
const Home = () => {
  return (
    <>
      <Header></Header>
      <main className="font-montserrat min-h-[800px] bg-white mt-[110px]">
        <Container></Container>
      </main>
      <Footer></Footer>
    </>
  );
};
export default Home;
