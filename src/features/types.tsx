import { OrderItem } from "@/app/(user)/cart/checkout/page";
import { UUID } from "crypto";

export type Category = {
  categoryId: number;
  name: string;
  parentName?: string;
  image: string;
  styleNames: string[];
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
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
};

export type StyleValue = {
  styleValueId: number;
  name: string;
  styleName: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
};

export type Product = {
  productId: number;
  name: string;
  description?: string;
  image: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  totalQuantity: number;
  totalSold: number;
  priceMin: number;
  promotionalPriceMin: number;
  rating: number;
  styleNames: string[];
  styleValueNames: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isSelling: boolean;
  isActive: boolean;
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
  role: string;
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

export type Cart = {
  cartId: number;
  cartItems: cartItem[];
  totalQuantity: number;
};

export type cartItem = {
  cartItemId: number;
  productItemId: number;
  productName: string;
  image: string;
  styleValues: string[];
  quantity: number;
  productPrice: number;
  productPromotionalPrice: number;
  amount: number;
};

export type orderItem = {
  orderId: number;
  totalAmount: number;
  checkout: boolean;
  fullName: string;
  phone: string;
  address: string;
  status: string;
  paymentMethod: string;
  createdAt?: Date;
  updateAt?: Date;
  customerId?: UUID;
};

export type productItem = {
  productItemId: number;
  parentId: number;
  parentName: string;
  quantity: number;
  sold: number;
  image: string;
  price: number;
  promotionalPrice: number;
  styleValueNames: string[];
  styleValueByStyles?: {
    Color: string;
    Size: string;
  };
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type productItemInOrder = {
  orderItemId: number;
  productItemId: number;
  productName: string;
  image: string;
  styleValues: string[];
  quantity: number;
  productPrice: number; //product order price
  productPromotionalPrice: number;
  amount: number;
};

export type Order = {
  id: number;
  amount: number;
  orderItem: orderItem;
  address: string;
  phone: string;
  status: string;
};

export type deliveryItem = orderItem & {
  deliveryId: number;
  note: string;
  isReceived: boolean;
  isDelivered: boolean;
  shipperName: string;
  recipientName: string;
  shipperId: UUID;
  checkoutStatus: boolean;
};
export type RatingType = {
  fulname: string;
  image: string | null;
  createdAt?: Date;
  styleValueByStyles: {
    [x: string]: string;
  };
  content: string;
  star: number;
};
