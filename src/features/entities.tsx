import { UUID } from "crypto";

export type Category = {
  id: number;
  parentId?: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  promotionalPrice: number;
  quantity: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  isSelling: boolean;
};

export type User = {
  id: UUID;
  fullName?: string;
  email: string;
  phone: string;
  isVerified: boolean;
  role: string;
  address?: string;
  password: string;
  avatar: string | "";
  eWallet: number;
  createdAt: Date;
  updatedAt: Date;
};

export type cartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};

export type orderItem = {
  id: number;
  orderDate: Date;
  status: string;
  orderItemList: cartItem[];
};

export type Order = {
  id: number;
  amount: number;
  orderItem: orderItem;
  address: string;
  phone: string;
  status: string;
};
