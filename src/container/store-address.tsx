import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import Link from "next/link";
const StoreAddress = () => {
  const storeAddressList = [
    {
      address: "108 Ngô Quyền, Thống Nhất, Kon Tum, 580000, Việt Nam",
      link: "https://maps.app.goo.gl/9hahHJLRrWXPUmjK7",
    },
    {
      address:
        "AT Shop, Tổ 12 KP1, An Phú Đông, Quận 12, Thành phố Hồ Chí Minh",
      link: "https://maps.app.goo.gl/gFrQdyLw5oDz1eJZ7",
    },
    {
      address: "Tân Sơn Nhì, Tân Phú, Thành phố Hồ Chí Minh, Việt Nam",
      link: "https://maps.app.goo.gl/wjiBr99t5JrbxnK4A",
    },
    {
      address:
        "87 Đ. Nguyễn Trãi, Phường Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh 70000, Việt Nam",
      link: "https://maps.app.goo.gl/wPsZfGynkd1CDDoJA",
    },
  ];

  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4">
      <div className="col-span-full grid grid-cols-12">
        <div className={`col-span-full text-center mb-4 md:mb-8`}>
          <span className="product-title">Hệ Thống Cửa Hàng</span>
        </div>
      </div>
      <div className="col-span-full grid grid-cols-12 gap-7 place-content-center bg-secondary-color">
        <div className="col-span-12 lg:col-span-5">
          <iframe
            title="g-map"
            className="w-full h-[24rem] md:h-[32rem]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.3704162014656!2d108.00551247695769!3d14.347962347419967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316bff98684fa879%3A0x4f8e8fcb85ded51e!2sAT%20Shop!5e0!3m2!1svi!2s!4v1701348122270!5m2!1svi!2s"
            height="480"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <ul className="col-span-12 lg:col-span-7 grid grid-cols-12">
          {storeAddressList.map((item, index) => {
            return (
              <li
                key={index}
                className="col-span-full flex justify-center items-center gap-x-2 text-white text-lg p-6
                border-b border-border-color"
              >
                <LocationOnIcon />
                <p className="font-medium w-[30rem]">{item.address}</p>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    sx={{
                      outlineColor: "white",
                      color: "white",
                      border: "1px solid white",
                      "&:hover": {
                        opacity: "0.6",
                        cursor: "pointer",
                        border: "1px solid white",
                      },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    className="bg-white! text-white!"
                    variant="outlined"
                  >
                    Tọa lạc
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default StoreAddress;
