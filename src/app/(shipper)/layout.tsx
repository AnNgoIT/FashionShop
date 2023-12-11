import React, { ReactNode } from "react";
import ShipperLayout from "@/container/shipper/shipper-layout";

const Layout = async ({ children }: { children: ReactNode }) => {
  return <ShipperLayout>{children}</ShipperLayout>;
};

export default Layout;
