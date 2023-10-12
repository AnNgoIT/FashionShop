"use client";
import { img1 } from "@/assests/images";
import Header from "@/components/header/header";
import Button from "@/components/button";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ReactNode } from "react";
import Footer from "@/components/footer/footer";

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}`;
};

const HomePage = ({ children }: { children: ReactNode }) => {
  return;
  <>
    <Header></Header>
    <main className="container p-4 font-sans">
      <div className="grid gap-4 place-content-center	grid-cols-1 md:p-3 md:grid-cols-3 lg:grid-cols-4 mb-144">
        {children}
      </div>
    </main>
    <Footer></Footer>
  </>;
};
export default HomePage;
