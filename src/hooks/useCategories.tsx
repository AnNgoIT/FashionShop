import useSWR, { preload } from "swr";
import { HTTP_PORT, getData } from "./useData";

export const preloadAllCategories = () => {
  preload(`${HTTP_PORT}/api/v1/categories`, (url: string) => getData(url));
};

export const useAllCategories = () => {
  const { data, error, isLoading } = useSWR(
    `${HTTP_PORT}/api/v1/categories`,
    (url: string) => getData(url),
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
    categories: data,
    isCategoriesError: error,
    isCategoriesLoading: isLoading,
  };
};
