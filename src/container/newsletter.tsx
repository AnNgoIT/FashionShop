import React from "react";

const Newsletter = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 mt-8 mb-16 md:mt-12">
      <div className="col-span-full grid grid-cols-12 place-content-center bg-background md:py-[6.25rem] p-6">
        <span
          className="col-span-full text-[1.5rem] md:text-[2rem] text-center font-extrabold px-4 uppercase text-[#333]
      relative place-items-center mb-4"
        >
          Đăng ký ngay
        </span>
        <p className="col-span-full text-[14px] text-[#999] pb-4 text-center">
          Nhiều sản phẩm hấp dẫn đang chờ bạn, nhận được ưu đãi sớm nhất
        </p>
        <div className="col-span-full grid grid-cols-12 col-start-3">
          <div className={`col-span-10 font-sans relative`}>
            <input
              className="text-[14px] h-[53px] rounded-full py-[10px] w-full px-5 flex-1 border border-[#e6e6e6] outline-none"
              placeholder="Nhập email của bạn"
            ></input>
            <button
              className="absolute z-[2] right-0 rounded-full bg-primary-color text-base font-medium text-center 
                            leading-4 text-white py-[18px] px-[26px] hover:bg-text-color hover:cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
