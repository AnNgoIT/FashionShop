import { fetchAllCategories } from "@/app/(guest)/product/page";
import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminCoupon from "@/container/admin/admin-coupon";
import { Coupon } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const fetchAllCoupons = async (accessToken: string, refreshToken: string) => {
  try {
    if (accessToken || refreshToken) {
      const res = await fetch(`${HTTP_PORT}/api/v1/users/admin/coupons`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache",
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // next: { revalidate: 100 },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      if (res.status == 401) {
        const res2 = await refreshLogin(refreshToken);
        if (res2.success) return res2;
        else return undefined;
      }
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.
      return res.json();
    }
  } catch (error: any) {}
};

async function fetchAllSaleBanners() {
  const res = await fetch(`${HTTP_PORT}/api/v1/banners`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "same-origin", // no-cors, *cors, same-origin
    cache: "no-cache",
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json();
}

export default async function AdminCouponPage() {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;
  const [res, bannerRes, cateRes] = await Promise.all([
    fetchAllCoupons(accessToken, refreshToken),
    fetchAllSaleBanners(),
    fetchAllCategories(),
  ]);

  let coupons: Coupon[] = [],
    fullToken = undefined;
  const handleCouponsResponse = async (res: any) => {
    if (accessToken) {
      coupons = res.result.couponList as Coupon[];
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const res2 = await fetchAllCoupons(
        fullToken.accessToken,
        fullToken.refreshToken
      );
      coupons = res2.success ? (res2.result.couponList as Coupon[]) : [];
    }
  };
  await handleCouponsResponse(res);
  const banners = bannerRes.result.content;
  const categories = cateRes.result.content;

  return (
    <AdminCoupon coupons={coupons} banners={banners} categories={categories} />
  );
}
