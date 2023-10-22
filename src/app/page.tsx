"use client";
import { CartStateProvider } from "@/store/globalState";
import dynamic from "next/dynamic";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Header = dynamic(() => import("@/components/header/header"));
const Container = dynamic(() => import("@/container/container"));
const Footer = dynamic(() => import("@/components/footer/footer"));
const Home = () => {
  return (
    <CartStateProvider>
      <Container></Container>
    </CartStateProvider>
  );
};
export default Home;
