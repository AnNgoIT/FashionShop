import { onlyNumbers, MaxAmounts } from "./FilterAmount";

const getUniqueObjects = (dataArray: any[]) => {
  const uniqueNames = new Set();
  const uniqueObjects: any[] = [];

  dataArray.forEach((obj) => {
    if (!uniqueNames.has(obj.nation)) {
      uniqueNames.add(obj.nation);
      uniqueObjects.push(obj);
    }
  });
  return uniqueObjects;
};

export type ProductDetail = {
  [x: string]: any;
  name?: string;
  price?: number;
  status?: boolean;
  quantity?: number;
  description?: string;
  id: number;
  orderDetails?: [];
  productImage?: {
    url: string;
    id: number;
  };
  categoryId?: number;
};

export { onlyNumbers, MaxAmounts, getUniqueObjects };
