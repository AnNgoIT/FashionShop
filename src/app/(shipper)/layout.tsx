"use client";
import React, { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

const defaultTheme = createTheme();

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
