import AdminStyle from "@/container/admin/admin-style";
import React from "react";
import { fetchAllStyles } from "../categories/page";

const StylesPage = async () => {
  const res = await fetchAllStyles();
  const style = res && res.success && res.result.content;
  return <AdminStyle styles={style} />;
};

export default StylesPage;
