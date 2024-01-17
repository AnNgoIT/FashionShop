import React, { ReactNode } from "react";

import { VerifyEmailProvider } from "@/store";

import AccountHeader from "@/components/header/account-header";

const AccountLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <VerifyEmailProvider>
        <AccountHeader products={[]} />
        <main className="font-montserrat py-12 bg-white relative z-0">
          <section className="container grid grid-cols-12 md:p-4 p-2">
            {children}
          </section>
        </main>
        {/* <Footer /> */}
      </VerifyEmailProvider>
    </>
  );
};

export default AccountLayout;
