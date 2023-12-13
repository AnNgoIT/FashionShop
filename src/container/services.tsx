import {
  faTruckFast,
  faGift,
  faPersonCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Services = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4">
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
              className={`text-primary-color uppercase text-lg mt-[3px] max-[575px]:leading-[25px] font-semibold text-ellipsis whitespace-nowrap`}
            >
              Miễn phí vận chuyển
            </h1>
            <p className="text-[#999] text-sm">
              Miễn phí vận chuyển đơn hàng từ 200k VNĐ
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
              className={`text-primary-color uppercase text-lg mt-[3px] max-[575px]:leading-[25px] font-semibold`}
            >
              ƯU ĐÃI GIẢM GIÁ
            </h1>
            <p className="text-[#999] text-sm">
              Ưu đãi hấp dẫn trên nhiều loại sản phẩm tốt
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
              className={`text-primary-color uppercase text-lg mt-[3px] max-[575px]:leading-[25px] font-semibold`}
            >
              CHĂM SÓC KHÁCH HÀNG
            </h1>
            <p className="text-[#999] text-sm">
              Hỗ trợ khách hàng tận tình và nhanh chóng
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Services;
