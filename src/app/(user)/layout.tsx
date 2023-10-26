import Link from "next/link";
import { title } from "process";
import React, { ReactNode } from "react";

type Props = {
  children?: React.ReactNode;
  title?: string;
  urlLink?: string[];
};

const UserLayout = ({ children, urlLink, title }: Props) => {
  return (
    <>
      <section className="lg:container lg:border-[10px] border-white bg-background py-16 md:py-28">
        <div className={`grid grid-cols-1`}>
          <div className="flex items-center justify-center flex-col lg:flex-row lg:justify-between ">
            <span className="text-2xl leading-[30px] tracking-[1px] uppercase font-semibold text-white mb-[10px] lg:mb-0">
              {title}
            </span>
            <ul className="flex">
              {urlLink?.map((value: string, index: number) => {
                const nextLink = urlLink[index + 1];
                let thisLink = null;
                if (nextLink !== undefined && value !== "home") {
                  thisLink = (
                    <>
                      <Link
                        className="group-hover:cursor-pointer group-hover:opacity-60
                  transition-all duration-200 capitalize text-[18px]"
                        href={`/${value}`}
                      >
                        {value}
                      </Link>
                      <span className="px-[10px]">/</span>
                    </>
                  );
                } else if (value === "home") {
                  thisLink = (
                    <>
                      <Link
                        className="group-hover:cursor-pointer group-hover:opacity-60
                  transition-all duration-200 capitalize text-[18px]"
                        href={`/`}
                      >
                        {value}
                      </Link>
                      <span className="px-[10px]">/</span>
                    </>
                  );
                } else
                  thisLink = (
                    <span className="capitalize text-[18px]">{value}</span>
                  );
                return (
                  <li
                    key={index}
                    className={`font-medium ${nextLink ? `group` : ``}`}
                  >
                    {thisLink}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      {children}
    </>
  );
};

export default UserLayout;
