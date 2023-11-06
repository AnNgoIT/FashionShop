"use client";
import React, { ReactNode } from "react";

import "moment/locale/de";
import AccountHeader from "@/components/header/account-header";
import Footer from "@/components/footer/footer";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AccountHeader />
      <main className="font-montserrat min-h-[40rem] py-12 bg-white">
        <section className="container grid grid-cols-12 max-md:p-4 gap-x-2">
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AccountLayout;
