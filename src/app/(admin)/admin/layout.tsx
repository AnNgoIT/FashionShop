import Dashboard from "@/components/dashboard/Dashboard";

import React, { ReactNode } from "react";

// export const runtime = "edge"; // 'nodejs' (default) | 'edge'
export const metadata = {
  title: "Admin",
};

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  return <Dashboard>{children}</Dashboard>;
};

export default AdminLayout;
