import AdminStyleValue from "@/container/admin/admin-style-value";
import React from "react";
import { fetchAllStyleValues } from "../products/page";
import { fetchAllStyles } from "../categories/page";

const StyleValuePage = async () => {
  const res = await fetchAllStyleValues();
  const styleRes = await fetchAllStyles();
  const styleValue = res && res.success && res.result.content;
  const style = styleRes && styleRes.success && styleRes.result.content;
  return <AdminStyleValue styleValues={styleValue} styles={style} />;
};

export default StyleValuePage;
