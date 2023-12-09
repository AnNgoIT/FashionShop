import Shipper from "@/container/shipper/shipper";

async function customFunction() {}

export default async function ShipperPage() {
  const data = await customFunction();
  return <Shipper />;
}
