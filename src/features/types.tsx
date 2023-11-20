import { UUID } from "crypto";

export type Category = {
  id: number;
  length: number;
  categoryId: number;
  parent?: Category;
  name: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
};

export type Brand = {
  brandId: number;
  name: string;
  nation: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
};

export type Style = {
  styleId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type StyleValue = {
  styleValueId: number;
  name: string;
  style: Style;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type Product = {
  productId: string;
  name: string;
  description?: string;
  image: string;
  priceMin: number;
  promotionalPriceMin: number;
  category: Category;
  brand: Brand;
  quantity: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  styles: Style[];
  styleValues: StyleValue[];
  coupons: number[] | [];
  followers: string[] | [];
  isSelling: boolean;
};

export type User = {
  userId: UUID;
  fullname: string | null;
  email: string;
  phone: string;
  isVerified: boolean;
  dob: Date | null;
  gender: string | null;
  role: string;
  address: string | null;
  password: string;
  avatar: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  isActive: boolean;
  ewallet: number | null;
};

export type UserInfo = {
  fullname: string | null;
  email: string;
  phone: string;
  dob: any;
  gender: string | null;
  address: string | null;
  avatar: string | null;
  ewallet: number | null;
};

export type Account = {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type AuthAccount = {
  accessToken: string;
  refreshToken: string;
};

export type VerifyEmail = {
  email: string;
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
