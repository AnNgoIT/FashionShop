import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminSaleBanner from "@/container/admin/admin-sale-banner";
import { SaleBanner } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

async function fetchAllSaleBanners(accessToken: string, refreshToken: string) {
  if (accessToken || refreshToken) {
    const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/banners`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    if (res.status == 401) {
      const res2 = await refreshLogin(refreshToken);
      if (res2.success) return res2;
      else return undefined;
    }
    return res.json();
  }
}

export default async function Page() {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;
  const res = await fetchAllSaleBanners(accessToken, refreshToken);
  let saleBanner: SaleBanner[] = [],
    fullToken =
      accessToken && refreshToken
        ? {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        : undefined;
  const handleSaleBannerResponse = async (res: any) => {
    if (accessToken) {
      saleBanner = res?.success && res.result.content;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const newSaleBanner = await fetchAllSaleBanners(
        fullToken?.accessToken!,
        fullToken?.refreshToken!
      );
      saleBanner = newSaleBanner?.success && newSaleBanner.result.content;
    }
  };
  await handleSaleBannerResponse(res);
  return <AdminSaleBanner banners={saleBanner} />;
}
