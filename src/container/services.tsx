import {
  faTruckFast,
  faGift,
  faPersonCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Services = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-flow-col place-content-center grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="group col-span-full lg:col-span-1 bg-background grid grid-flow-col place-content-center
            lg:place-content-start  p-5"
        >
          <div
            className="rounded-[30px] bg-primary-color grid place-items-center min-w-[60px] h-[60px]
            group-hover:bg-text-light-color transition-all"
          >
            <FontAwesomeIcon
              className="text-[25px] text-white"
              icon={faTruckFast}
            />
          </div>
          <article
            className={`text-left ml-[12px] min-w-[220px] max-w-[350px]`}
          >
            <h1
              className={`text-primary-color uppercase text-[20px] mt-[3px] max-[575px]:leading-[25px] font-semibold text-ellipsis whitespace-nowrap`}
            >
              free shipping
            </h1>
            <p className="text-[#999] text-sm">
              Free Shipping on orders over $130
            </p>
          </article>
        </div>
        <div
          className="group col-span-full lg:col-span-1 bg-background grid grid-flow-col place-content-center
            lg:place-content-start  p-5"
        >
          <div
            className="rounded-[30px] bg-primary-color grid place-items-center min-w-[60px] h-[60px]
            group-hover:bg-text-light-color transition-all"
          >
            <FontAwesomeIcon className="text-[25px] text-white" icon={faGift} />
          </div>
          <article
            className={`text-left ml-[12px] min-w-[220px] max-w-[350px]`}
          >
            <h1
              className={`text-primary-color uppercase text-[20px] mt-[3px] max-[575px]:leading-[25px] font-semibold`}
            >
              sale off
            </h1>
            <p className="text-[#999] text-sm">
              Attractive discount on product
            </p>
          </article>
        </div>
        <div
          className="group col-span-full lg:col-span-1 bg-background grid grid-flow-col place-content-center
            lg:place-content-start  p-5"
        >
          <div
            className="rounded-[30px] bg-primary-color grid place-items-center min-w-[60px] h-[60px]
            group-hover:bg-text-light-color transition-all"
          >
            <FontAwesomeIcon
              className="text-[25px] text-white"
              icon={faPersonCircleQuestion}
            />
          </div>
          <article
            className={`text-left ml-[12px] min-w-[220px] max-w-[350px]`}
          >
            <h1
              className={`text-primary-color uppercase text-[20px] mt-[3px] max-[575px]:leading-[25px] font-semibold`}
            >
              quick support
            </h1>
            <p className="text-[#999] text-sm">Quickly support customer</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Services;
