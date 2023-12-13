import React from "react";
import Image from "next/image";
import {
  sub_banner1,
  sub_banner2,
  sub_banner3,
  sub_banner4,
  sub_responsive_banner1,
  sub_responsive_banner2,
  sub_responsive_banner3,
  sub_responsive_banner4,
} from "@/assests/subbanner";
const SubBanner = () => {
  return (
    <section className="container grid grid-cols-12 p-4 mt-8 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 col-span-full gap-4">
        <div className="group md:col-span-4 bg-white subbanner-shadow">
          <Image
            alt="subbannerImage"
            className="md:block hidden group-hover:bg-white group-hover:cursor-pointer xl:h-full w-full"
            src={sub_banner1}
          ></Image>
          <Image
            alt="subannerImage_reponsive"
            className="md:hidden block group-hover:cursor-pointer w-full"
            src={sub_responsive_banner1}
          ></Image>
        </div>

        <div className="grid md:col-span-8 bg-white gap-4">
          <div className="grid grid-flow-col grid-cols-3 gap-4">
            <div className="group subbanner-shadow col-span-full md:col-span-2">
              <Image
                alt="subbannerImage"
                className="md:block hidden group-hover:cursor-pointer h-full w-full "
                src={sub_banner2}
              ></Image>
              <div className="group subbanner-shadow">
                <Image
                  alt="subannerImage_reponsive"
                  className="md:hidden block group-hover:cursor-pointer w-full"
                  src={sub_responsive_banner2}
                ></Image>
              </div>
            </div>
            <div className="group subbanner-shadow col-span-full md:col-span-1">
              <Image
                alt="subbannerImage"
                className="md:block hidden group-hover:cursor-pointer xl:h-full w-full "
                src={sub_banner3}
              ></Image>
              <div className="group subbanner-shadow">
                <Image
                  alt="subannerImage_reponsive"
                  className="md:hidden block group-hover:cursor-pointer w-full"
                  src={sub_responsive_banner3}
                ></Image>
              </div>
            </div>
          </div>
          <div className="group bg-white subbanner-shadow">
            <Image
              alt="subbannerImage"
              className="md:block hidden group-hover:cursor-pointer h-full w-full"
              src={sub_banner4}
            ></Image>
            <Image
              alt="subannerImage_reponsive"
              className="md:hidden block group-hover:cursor-pointer h-full w-full"
              src={sub_responsive_banner4}
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubBanner;
