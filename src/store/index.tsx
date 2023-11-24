"use client";
import {
  AuthAccount,
  Product,
  User,
  UserInfo,
  VerifyEmail,
  cartItem,
} from "@/features/types";
import React, { createContext, useState } from "react";

interface VerifyEmailProps {
  verifyEmail: VerifyEmail;
  setVerifyEmail: React.Dispatch<React.SetStateAction<VerifyEmail>>;
}

interface CartContextProps {
  cartItems: cartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<cartItem[]>>;
}

interface UserContextProps {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
}

interface FilterProductContextProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
}

export const UserContext = createContext<UserContextProps>({
  user: {
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: "",
    ewallet: 0,
  },
  setUser: () => {},
});

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserInfo>({
    fullname: null,
    email: "",
    phone: "",
    dob: null,
    gender: null,
    address: null,
    avatar: "",
    ewallet: 0,
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  setCartItems: () => {},
});

export const VerifyEmailContext = createContext<VerifyEmailProps>({
  verifyEmail: { email: "" },
  setVerifyEmail: () => {},
});

export const FilterProductContext = createContext<FilterProductContextProps>({
  product: {
    productId: "",
    name: "",
    image: "",
    categoryId: 0,
    categoryName: "",
    brandId: 0,
    brandName: "",
    totalQuantity: 0,
    totalSold: 0,
    priceMin: 0,
    promotionalPriceMin: 0,
    rating: 0,
    stylesName: [],
    styleValueNames: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isSelling: false,
    isActive: false,
  },
  setProduct: () => {},
});

export const VerifyEmailProvider = ({ children }: any) => {
  const [verifyEmail, setVerifyEmail] = useState<VerifyEmail>({
    email: "",
  });

  return (
    <VerifyEmailContext.Provider value={{ verifyEmail, setVerifyEmail }}>
      {children}
    </VerifyEmailContext.Provider>
  );
};

export const FilterProductlProvider = ({ children }: any) => {
  const [product, setProduct] = useState<Product>({
    productId: "",
    name: "",
    image: "",
    categoryId: 0,
    categoryName: "",
    brandId: 0,
    brandName: "",
    totalQuantity: 0,
    totalSold: 0,
    priceMin: 0,
    promotionalPriceMin: 0,
    rating: 0,
    stylesName: [],
    styleValueNames: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isSelling: false,
    isActive: false,
  });

  return (
    <FilterProductContext.Provider value={{ product, setProduct }}>
      {children}
    </FilterProductContext.Provider>
  );
};

export const CartStateProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([
    {
      id: 1,
      name: "Men's Full Sleeves Collar Shirt",
      price: 100000,
      quantity: 1,
      maxQuantity: 2,
    },
    {
      id: 2,
      name: "Women's Cape Jacket",
      price: 150000,
      quantity: 1,
      maxQuantity: 1,
    },
    // {
    //   id: 3,
    //   name: "Men's Regular Fit T-Shirt",
    //   price: 200000,
    //   quantity: 1,
    //   maxQuantity: 3,
    // },
  ]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
