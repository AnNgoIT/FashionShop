import { fetchUserCredentials } from "@/app/page";
import ProfileForm from "@/container/profile/profile-form";
import { refreshLogin } from "@/hooks/useAuth";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

const ProfilePage = async () => {
  const accessToken = getCookie("accessToken", { cookies })!;

  let userInfo = undefined,
    fullToken = undefined;

  const res = await fetchUserCredentials(accessToken);

  userInfo = res &&
    res.success && {
      fullname: res.result.fullname,
      email: res.result.email,
      phone: res.result.phone,
      dob: res.result.dob,
      gender: res.result.gender,
      address: res.result.address,
      avatar: res.result.avatar,
      ewallet: res.result.ewallet,
      role: res.result.role,
    };
  if (
    !hasCookie("accessToken", { cookies }) &&
    hasCookie("refreshToken", { cookies })
  ) {
    const refreshToken = getCookie("refreshToken", { cookies })!;
    const refresh = await refreshLogin(refreshToken);
    if (refresh.success) {
      fullToken = refresh.result;
      const res = await fetchUserCredentials(refresh.result.accessToken);
      userInfo = res &&
        res.success && {
          fullname: res.result.fullname,
          email: res.result.email,
          phone: res.result.phone,
          dob: res.result.dob,
          gender: res.result.gender,
          address: res.result.address,
          avatar: res.result.avatar,
          ewallet: res.result.ewallet,
          role: res.result.role,
        };
    }
  }

  return <ProfileForm info={userInfo} />;
};

export default ProfilePage;
