import { useContext, useEffect } from "react";
import { UserContext } from "@/store";
import { refreshLogin, useUserCredentials } from "./useAuth";
import { getCookie, hasCookie, setCookie } from "cookies-next";

export default function useSession() {
  const { user, setUser } = useContext(UserContext);

  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  // if (isUserInfoLoading) return null;
  // async function fetchUser() {
  //   try {
  //     const userInfo = await getUserCredentials(accessToken);
  //     if (userInfo.success) {
  //       setUser(userInfo.result);
  //     } else if (userInfo.statusCode == 401) {
  //       if (!refreshToken) {
  //         return;
  //       }
  //       const refresh = await refreshLogin(refreshToken);
  //       if (refresh.success) {
  //         setCookie("accessToken", refresh.result.accessToken);
  //         setCookie("refreshToken", refresh.result.refreshToken);
  //         const refreshInfo = await getUserCredentials(
  //           refresh.result.accessToken
  //         );
  //         if (refreshInfo.success) {
  //           setUser(refreshInfo.result);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setUser({
  //       userId: "*****-*****-*****-*****-*****",
  //       fullname: null,
  //       email: "",
  //       phone: "",
  //       dob: null,
  //       gender: null,
  //       isVerified: false,
  //       role: "",
  //       address: null,
  //       password: "",
  //       avatar: "",
  //       ewallet: 0,
  //       createdAt: null,
  //       updatedAt: null,
  //       isActive: false,
  //     });
  //     // deleteCookie("accessToken");
  //     // deleteCookie("refreshToken");
  //     // Xử lý lỗi khi không thể lấy thông tin người dùng
  //   }
  // }
  // useEffect(() => {
  //   if (!hasCookie("accessToken")) {
  //     return;
  //   }
  //   fetchUser(); // Gọi API để lấy thông tin người dùng
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Sử dụng user.email để theo dõi thay đổi và gọi lại fetchUser() khi có sự thay đổi

  // return userInfo && userInfo.result; // Trả về thông tin người dùng và trạng thái loading
}
