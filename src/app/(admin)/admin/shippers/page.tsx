import AdminShipper from "@/container/admin/admin-shipper";
import { User } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getAllUsersByRoleName } from "../users/page";

export default async function Page() {
  const accessToken = getCookie("accessToken", { cookies })!;
  const refreshToken = getCookie("refreshToken", { cookies })!;

  let fullToken =
      accessToken && refreshToken
        ? {
            accessToken,
            refreshToken,
          }
        : undefined,
    refreshUsers: User[] = [];
  const res = await getAllUsersByRoleName(accessToken, refreshToken, "SHIPPER");
  const handleUsersResponse = async (res: any) => {
    if (accessToken) {
      refreshUsers = res?.success && res.result.userList;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const newOrders = await getAllUsersByRoleName(
        fullToken?.accessToken!,
        fullToken?.refreshToken!,
        "SHIPPER"
      );
      refreshUsers = newOrders?.success && newOrders.result.userList;
    }
  };
  await handleUsersResponse(res);

  return <AdminShipper shippers={refreshUsers} token={fullToken} />;
}
