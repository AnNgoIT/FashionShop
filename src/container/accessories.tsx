import React from "react";
import Products from "./products";
import { Product } from "@/features/types";

const Accessories = ({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) => {
  return <Products products={products} title={title} />;
};

export default Accessories;
