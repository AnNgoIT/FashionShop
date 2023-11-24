"use client";
import useSWR, { preload } from "swr";
import { HTTP_PORT, getData } from "./useData";

export const preloadAllProducts = () => {
  preload(`${HTTP_PORT}/api/v1/products`, (url: string) => getData(url));
};

export const preloadStyleValues = () => {
  preload(`${HTTP_PORT}/api/v1/styleValues`, (url: string) => getData(url));
};

export const useAllProducts = () => {
  const { data, error, isLoading } = useSWR(
    `${HTTP_PORT}/api/v1/products`,
    (url: string) => getData(url),
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
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
    products: data,
    isProductsError: error,
    isProductsLoading: isLoading,
  };
};

export const useProductDetail = (productId: string) => {
  const { data, error, isLoading } = useSWR(
    `${HTTP_PORT}/api/v1/products/` + productId,
    (url: string) => getData(url),
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
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
    }
  );
  return {
    productDetail: data,
    isProductDetailError: error,
    isProductDetailLoading: isLoading,
  };
};

export const useStyleValues = () => {
  const { data, error, isLoading } = useSWR(
    `${HTTP_PORT}/api/v1/styleValues`,
    (url: string) => getData(url),
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
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
    styleValues: data,
    isStyleValuesError: error,
    isStyleValuesLoading: isLoading,
  };
};
