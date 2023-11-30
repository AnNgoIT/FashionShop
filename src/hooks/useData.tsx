import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";
import { refreshLogin } from "./useAuth";

export const HTTP_PORT = "http://localhost:8080";

export const ACCESS_MAX_AGE = 60 * 60; //1 hours
export const REFRESH_MAX_AGE = 60 * 60 * 24; //1 days;

export function newAbortSignal(timeoutMs: number) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

export const getData = async (url: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': key,
    },
    signal: newAbortSignal(10000), // Aborts request after 5 seconds
  };

  try {
    const res = await axios.get(url, config);
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    console.log(error);
  }
};

export const getAuthenticated = async (url: string, accessToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + accessToken,
    },
    signal: newAbortSignal(2000), // Aborts request after 5 seconds
  };

  try {
    const res = await axios.get(url, config);
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    if (error.response.data.statusCode == 401) {
      if (hasCookie("refreshToken")) {
        const refreshToken = getCookie("refreshToken");
        try {
          const res = await refreshLogin(refreshToken!);
          const data = res && res.data ? res.data : {};
          return data;
        } catch (error) {
          return {};
        }
      }
    }
  }
};

export const getUserRole = async (accessToken: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + accessToken,
    },
    signal: newAbortSignal(2000), // Aborts request after 5 seconds
  };
  try {
    const res = await axios.get(`${HTTP_PORT}/api/v1/users/role`, config);
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    console.log(error);
  }
};
