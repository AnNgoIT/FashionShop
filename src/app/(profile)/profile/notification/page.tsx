import NotificationComponent from "@/container/profile/notification";

async function customFunction() {}

export default async function Page() {
  const data = await customFunction();
  return <NotificationComponent />;
}
