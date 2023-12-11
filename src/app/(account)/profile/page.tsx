import { fetchUserCredentials } from "@/app/page";
import ProfileForm from "@/container/profile/profile-form";
import { UserInfo } from "@/features/types";
import { refreshLogin } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

const ProfilePage = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;

  const res = await fetchUserCredentials(accessToken);

  let result = undefined,
    fullToken = undefined;
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      fullToken = refresh.result;
      const res = await fetchUserCredentials(refresh.result.accessToken);
      result = res;
    }
  }

  const userInfo: UserInfo | undefined =
    res && res.success
      ? {
          fullname: res.result.fullname,
          email: res.result.email,
          phone: res.result.phone,
          dob: res.result.dob,
          gender: res.result.gender,
          address: res.result.address,
          avatar: res.result.avatar,
          ewallet: res.result.ewallet,
          role: res.result.role,
        }
      : result && result.success
      ? {
          fullname: result.result.fullname,
          email: result.result.email,
          phone: result.result.phone,
          dob: result.result.dob,
          gender: result.result.gender,
          address: result.result.address,
          avatar: result.result.avatar,
          ewallet: result.result.ewallet,
          role: res.result.role,
        }
      : undefined;

  return <ProfileForm info={userInfo} />;
};

export default ProfilePage;
