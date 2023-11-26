import { Category } from "@/features/types";
import React from "react";

const BotNav = ({ categories }: { categories?: Category[] }) => {
  const cateList: Category[] | undefined = categories;
  return (
    <nav className="col-span-full py-2 mx-auto">
      <ul className="grid place-content-center grid-flow-col gap-x-4 text-white">
        {cateList &&
          cateList.length != 0 &&
          cateList.slice(0, 5).map((item: Category) => {
            return (
              <li className="" key={item.categoryId}>
                {item.name}
              </li>
            );
          })}
      </ul>
    </nav>
  );
};

export default BotNav;
