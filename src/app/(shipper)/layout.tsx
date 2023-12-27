import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

export const metadata = {
  title: "Shipper",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <Box sx={{ display: "flex" }}>{children}</Box>;
};

export default Layout;
