// "use client";
// import useSWRImmutable from "swr/immutable";
// import { getData } from "./useData";

// export const useProvinces = () => {
//   const { data, error, mutate, isLoading } = useSWRImmutable(
//     `http://provinces.open-api.vn/api/?depth=2`,
//     (url: string) => getData(url)
//   );
//   return {
//     result: data,
//     isError: error,
//     mutate,
//     isLoading,
//   };
// };
