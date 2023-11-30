"use client";
import Dashboard from "@/components/dashboard/Dashboard";
import usePath from "@/hooks/usePath";

import React, { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const thisPaths = usePath();
  let title = thisPaths.at(-1)!;
  if (title == "admin") title = "dashboard";
  return <Dashboard title={title}>{children}</Dashboard>;
};

export default AdminLayout;
