import { onlyNumbers, MaxAmounts } from "./FilterAmount";

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

export { onlyNumbers, MaxAmounts };
