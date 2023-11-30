import { fetchAllBrands } from "@/app/(user)/product/page";
import AdminBrand from "@/container/admin/admin-brand";
import React from "react";

const BandsPage = async () => {
  const res = await fetchAllBrands();
  const brand = res && res.success && res.result.content;
  return <AdminBrand brands={brand} />;
};

export default BandsPage;
