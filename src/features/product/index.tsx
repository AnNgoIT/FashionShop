import { onlyNumbers, MaxAmounts } from "./FilterAmount";

const getUniqueObjects = (dataArray: any[]) => {
  const uniqueNames = new Set();
  const uniqueObjects: any[] = [];

  dataArray.forEach((obj) => {
    if (!uniqueNames.has(obj.nation)) {
      uniqueNames.add(obj.nation);
      uniqueObjects.push(obj);
    }
  });
  return uniqueObjects;
};
export { onlyNumbers, MaxAmounts, getUniqueObjects };
