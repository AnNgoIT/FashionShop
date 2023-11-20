import axios from "axios";
import { HTTP_PORT, getAuthenticated, newAbortSignal } from "./useData";
import useSWR from "swr";
import { useContext } from "react";
import { UserContext } from "@/store";

axios.defaults.baseURL = HTTP_PORT;

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
    accessToken ? `${HTTP_PORT}/api/v1/users/customers/profile` : null,
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
      // 'Authorization': key,
    },
  };
  try {
    const res = await axios.post(
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
    const res = await axios.post(
      `${HTTP_PORT}/api/v1/auth/refresh-access-token`,
      { payload },
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error;
  }
};
