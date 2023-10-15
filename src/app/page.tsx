"use client";
import Header from "@/components/header/header";
import { ReactNode } from "react";
import Footer from "@/components/footer/footer";
import { CartStateProvider } from "@/store/globalState";

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?w=${width}`;
};

const Home = ({ children }: { children: ReactNode }) => {
  return (
    <CartStateProvider>
      <Header></Header>
      <main className="container font-montserrat min-h-full">
        <div className="grid gap-4 place-content-center	grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-background">
          {children}
        </div>
      </main>
      <Footer></Footer>
    </CartStateProvider>
  );
};
export default Home;
