"use client";
import {
  AuthAccount,
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
