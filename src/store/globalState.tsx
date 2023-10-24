"use client";
import React, { createContext, useState } from "react";

export type cartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};
interface CartContextProps {
  cartItems: cartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<cartItem[]>>;
}

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  setCartItems: () => {},
});

export const CartStateProvider = ({ children }: any) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([
    {
      id: 1,
      name: "Men's Full Sleeves Collar Shirt",
      price: 100000,
      quantity: 1,
      maxQuantity: 0,
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
