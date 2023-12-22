import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Stack } from "@mui/material";
import { Product } from "@/features/types";
import Title from "./Title";

export default function Top3ProductsPieChart({
  products,
}: {
  products: Product[];
}) {
  const items = products.map((product, index) => {
    return {
      value: product.totalSold,
      label: `Top ${index + 1}: ${product.name.slice(0, 15)} - ${
        product.totalSold
      } sản phẩm`,
    };
  });

  return (
    <Stack direction={{ xs: "column", md: "column" }} sx={{ width: "100%" }}>
      <Title>Top 3 sản phẩm bán chạy nhất</Title>
      <PieChart
        series={[
          {
            data: items,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            arcLabel: (item) => `${item.value}`,
          },
        ]}
        sx={{
          width: "100%",
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
        }}
        height={160}
        margin={{ right: 340 }}
      />
    </Stack>
  );
}
