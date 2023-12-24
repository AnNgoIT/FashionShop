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
    users: User[] = [];
  const res = await getAllUsersByRoleName(accessToken, refreshToken, "SHIPPER");
  const handleUsersResponse = async (res: any) => {
    if (accessToken) {
      users = res?.success && res.result.userList;
    } else {
      fullToken = res?.success
        ? res.result
        : { accessToken: undefined, refreshToken: undefined };
      const newOrders = await getAllUsersByRoleName(
        fullToken?.accessToken!,
        fullToken?.refreshToken!,
        "SHIPPER"
      );
      users = newOrders?.success && newOrders.result.userList;
    }
  };
  await handleUsersResponse(res);

  return <AdminShipper shippers={users} token={fullToken} />;
}
