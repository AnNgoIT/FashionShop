import { HTTP_PORT, refreshLogin } from "@/app/page";
import AdminUser from "@/container/admin/admin-user";
import { User } from "@/features/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function getAllUsersByRoleName(
  accessToken: string,
  refreshToken: string,
  roleName: string
) {
  if ((accessToken || refreshToken) && roleName) {
    const res = await fetch(
      `${HTTP_PORT}/api/v1/users/admin/user-management/users?roleName=${roleName}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache",
        mode: "same-origin", // no-cors, *cors, same-origin
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    );
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

  let fullToken =
      accessToken && refreshToken
        ? {
            accessToken,
            refreshToken,
          }
        : undefined,
    refreshUsers: User[] = [];
  const res = await getAllUsersByRoleName(
    accessToken,
    refreshToken,
    "CUSTOMER"
  );
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
        "CUSTOMER"
      );
      refreshUsers = newOrders?.success && newOrders.result.userList;
    }
  };
  await handleUsersResponse(res);

  return <AdminUser users={refreshUsers} token={fullToken} />;
}
