// import { errorMessage, warningMessage } from "@/features/toasting";
// import { refreshLogin } from "@/hooks/useAuth";
// import { HTTP_PORT } from "@/hooks/useData";
// import axios, { AxiosResponse, AxiosError } from "axios";
// import { deleteCookie, getCookie } from "cookies-next";
// import AxiosNextError from "./CustomError";

// const ACCESS_TOKEN_COOKIE = "accessToken";
// const REFRESH_TOKEN_COOKIE = "refreshToken";
// const UNAUTHORIZED_ERROR_MESSAGE = "Tạo mới phiên đăng nhập thất bại";

// const request = axios.create({
//   baseURL: HTTP_PORT,
//   timeout: 5000,
// });

// request.interceptors.request.use(async (config) => {
//   const accessToken = getAccessToken();
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }
//   config.headers["Content-Type"] = "application/json";
//   return config;
// });

// const handleRefreshError = (errorMessage: string) => {
//   deleteCookie(ACCESS_TOKEN_COOKIE);
//   deleteCookie(REFRESH_TOKEN_COOKIE);
//   return Promise.reject({ message: errorMessage });
// };

// const handleUnauthorizedError = async (error: AxiosError) => {
//   try {
//     const newAccessToken = await refreshAccessToken();
//     if (newAccessToken) {
//       if (error.config?.headers) {
//         error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return axios(error.config);
//       } else {
//         return Promise.reject({ message: "Không có cấu hình yêu cầu" });
//       }
//     } else {
//       return handleRefreshError(UNAUTHORIZED_ERROR_MESSAGE);
//     }
//   } catch (refreshError) {
//     return Promise.reject(refreshError);
//   }
// };

// export const getAccessToken = (): string => {
//   return getCookie(ACCESS_TOKEN_COOKIE) || "";
// };

// export const refreshAccessToken = async (): Promise<string | void> => {
//   const refreshToken = getCookie(REFRESH_TOKEN_COOKIE) || "";

//   try {
//     const newLoginSession = await refreshLogin(refreshToken);
//     if (
//       newLoginSession &&
//       newLoginSession.result &&
//       newLoginSession.result.accessToken
//     ) {
//       return newLoginSession.result.accessToken;
//     } else {
//       throw new AxiosNextError(
//         "Lấy accessToken mới thất bại",
//         null,
//         newLoginSession.statusCode
//       );
//     }
//   } catch (error: any) {
//     return handleRefreshError(UNAUTHORIZED_ERROR_MESSAGE);
//   }
// };

// const fetchApi = async (name: string) => {
//   try {
//     const res = await request.get("/api/v1/users", {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`,
//         "Content-Type": "appication/json",
//       },
//       params: {
//         name,
//       },
//     });
//     return res.data;
//   } catch (error: any) {
//     const e = error.reponse.data;
//     if (e.status == 404) {
//       warningMessage("Đường dẫn api không chính xác");
//     } else if (e.statusCode == 400) {
//       errorMessage("Dữ liệu truyền vào không hợp lệ");
//     } else if (e.statusCode == 500) {
//       errorMessage("Lỗi hệ thống");
//     }
//   }
// };

// request.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response.data;
//   },
//   async (error: AxiosError) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         return handleUnauthorizedError(error);
//       } else {
//         throw new AxiosNextError(
//           error.message,
//           error.response.data,
//           error.response.status
//         );
//       }
//     } else {
//       throw new AxiosNextError(error.message, null, 500);
//     }
//   }
// );

// export default request;
