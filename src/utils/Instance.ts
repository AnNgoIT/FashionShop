// import { errorMessage, warningMessage } from "@/features/toasting";
// import { refreshLogin } from "@/hooks/useAuth";
// import { HTTP_PORT } from "@/hooks/useData";
// import axios, { AxiosResponse, AxiosError } from "axios";
// import { deleteCookie, getCookie } from "cookies-next";

// const request = axios.create({
//   baseURL: HTTP_PORT,
//   timeout: 5000,
// });

// request.interceptors.request.use(async (config) => {
//   const accessToken = getAccessToken(); // Hàm lấy access_token từ localStorage hoặc trạng thái ứng dụng
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }
//   config.headers["Content-Type"] = "application/json";
//   return config;
// });

// const handleRefreshError = (errorMessage: string) => {
//   deleteCookie("accessToken");
//   deleteCookie("refreshToken");
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
//       return handleRefreshError("Tạo mới phiên đăng nhập thất bại");
//     }
//   } catch (refreshError) {
//     return Promise.reject(refreshError);
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
//         return Promise.reject(error.response.data);
//       }
//     } else {
//       return Promise.reject(error.message);
//     }
//   }
// );

// // Hàm lấy access_token từ cookie
// export const getAccessToken = () => {
//   const accessToken = getCookie("accessToken") || "";
//   return accessToken;
// };

// export const refreshAccessToken = async () => {
//   const refreshToken = getCookie("refreshToken") || "";

//   try {
//     // Thực hiện gọi API refresh access token và trả về access token mới
//     const newLoginSession = await refreshLogin(refreshToken);
//     if (
//       newLoginSession &&
//       newLoginSession.result &&
//       newLoginSession.result.accessToken
//     ) {
//       return newLoginSession.result.accessToken;
//     } else {
//       return Promise.reject(new Error("Lấy accessToken mới thất bại"));
//     }
//   } catch (error: any) {
//     return handleRefreshError("Tạo mới phiên đăng nhập thất bại");
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
// export default request;
