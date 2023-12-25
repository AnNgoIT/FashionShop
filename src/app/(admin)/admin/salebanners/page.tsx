import { HTTP_PORT } from "@/app/page";
import AdminSaleBanner from "@/container/admin/admin-sale-banner";
import { SaleBanner } from "@/features/types";

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

export default async function Page() {
  const res = await fetchAllSaleBanners();
  const saleBanner: SaleBanner[] = res?.success && res.result.content;

  return <AdminSaleBanner banners={saleBanner} />;
}
