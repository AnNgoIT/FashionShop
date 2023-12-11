"use client";
import { HTTP_PORT } from "./useData";
import axios from "axios";

export const addProductItemToCart = async (
  accessToken: string,
  payload: any
) => {
  const config: any = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/users/customers/carts/cartItems`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};
