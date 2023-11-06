import useSWR from "swr";
import { getData } from "../useData";

export const useProvinces = () => {
  const { data, error, mutate, isLoading } = useSWR(
    `https://provinces.open-api.vn/api/?depth=3`,
    (url: string) => getData(url)
  );
  return {
    result: data,
    isError: error,
    mutate,
    isLoading,
  };
};
