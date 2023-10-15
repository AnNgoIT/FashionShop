import React from "react";

const BotNav = () => {
  return (
    <nav className="col-span-full py-2 mx-auto">
      <ul className="grid place-content-center grid-flow-col gap-x-4 text-text-color">
        {[1, 2, 3, 4, 5, 6, 7].map((i: number) => {
          return (
            <li className="" key={i}>
              Item {i}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BotNav;
