import { productItem } from "../types";
import { onlyNumbers, MaxAmounts } from "./FilterAmount";

const getUniqueProductItems = (dataArray: productItem[]) => {
  const uniqueColors: string[] = [];
  const uniqueItemsByColor: productItem[] = [];

  dataArray.forEach((item) => {
    const color = item.styleValueByStyles && item.styleValueByStyles.Color;
    if (!uniqueColors.includes(color!)) {
      uniqueColors.push(color!);
      uniqueItemsByColor.push(item);
    }
  });
  return uniqueItemsByColor;
};
export { onlyNumbers, MaxAmounts, getUniqueProductItems };
