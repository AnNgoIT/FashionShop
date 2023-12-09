"use client";
import axios from "axios";
import { HTTP_PORT, getAuthenticated } from "./useData";
import useSWR from "swr";

export const register = async (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': key,
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/register`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const login = async (payload: any) => {
  const config: any = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/login`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const useUserCredentials = (accessToken: string) => {
  const { data, error, isLoading } = useSWR(
    accessToken ? `${HTTP_PORT}/api/v1/users/profile` : null,
    (url: string) => getAuthenticated(url, accessToken),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return;

        // Never retry for a specific key.
        if (key === "/api/user") return;

        // Only retry up to 3 times.
        if (retryCount >= 3) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 1000);
      },
      // suspense: true,
    }
  );
  return {
    userData: data,
    isUserDataError: error,
    isUserDataLoading: isLoading,
  };
};

export const deleteUnverifyEmail = async (email: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.delete(
      `${HTTP_PORT}/api/v1/auth/accounts/unverified/${email}`,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};

export const logout = async (accessToken: string, refreshToken: string) => {
  const config: any = {
    headers: {
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/logout?refreshToken=${refreshToken}`,
      {},
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};

export const sendOTP = async (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': key,
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/send-otp-verify-email`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};

export const verifyOTP = async (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': key,
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/verify-otp-register`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};

export const refreshLogin = async (refreshToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': key,
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/refresh-access-token`,
      { refreshToken },
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};

export const updateProfile = async (accessToken: string, payload: any) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.put(
      `${HTTP_PORT}/api/v1/users/profile`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const forgotPassword = async (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/forgot-password`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const resetPassword = async (payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/reset-password`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const changePassword = async (accessToken: string, payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.patch(
      `${HTTP_PORT}/api/v1/users/change-password`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getUserCart = async (accessToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.get(
      `${HTTP_PORT}/api/v1/users/customers/carts`,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getUserInfo = async (accessToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.get(`${HTTP_PORT}/api/v1/users/profile`, config);
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const updateCartItem = async (
  accessToken: string,
  payload: any,
  cartItemId: number
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.patch(
      `${HTTP_PORT}/api/v1/users/customers/carts/cartItems/${cartItemId}`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const deleteCartItem = async (
  accessToken: string,
  cartItemId: number
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.delete(
      `${HTTP_PORT}/api/v1/users/customers/carts/cartItems/${cartItemId}`,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const deleteAllCartItem = async (accessToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.delete(
      `${HTTP_PORT}/api/v1/users/customers/carts/cartItems`,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const makeAnOrder = async (accessToken: string, payload: any) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/users/customers/orders`,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.data;
  }
};

export const getUserOrder = async (orderId: number, accessToken: string) => {
  const config = {
    headers: {
      "Cache-Control": "force-cache",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.get(
      `${HTTP_PORT}/api/v1/users/customers/orders/${orderId}`,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const cancelOrder = async (orderId: number, accessToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.patch(
      `${HTTP_PORT}/api/v1/users/customers/orders/cancel/${orderId}`,
      {},
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
