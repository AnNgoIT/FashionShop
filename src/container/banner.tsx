import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  banner_thoi_trang_nam,
  banner_thoi_trang_nu,
  banner_thoi_trang_nu_2,
  main_banner1,
  main_banner2,
  main_banner3,
  main_banner_chinh,
  sale_banner1,
  sale_banner2,
} from "@/assests/images";
import Box from "@mui/material/Box";
import { imageLoader } from "@/features/img-loading";
import Image from "next/image";
export const MyArrowNext = (clickHandler: () => void, hasNext: boolean) => {
  return (
    <div
      onClick={clickHandler}
      className={`${
        hasNext ? "group hover:bg-primary-color" : ""
      } myarrow right-0 translate-x-8`}
    >
      <FontAwesomeIcon
        className="group-hover:text-white text-[17px] text-text-light-color"
        icon={faChevronRight}
      />
    </div>
  );
};
export const MyArrowPrev = (clickHandler: () => void, hasPrev: boolean) => {
  return (
    <div
      onClick={clickHandler}
      className={`${
        hasPrev ? "group hover:bg-primary-color" : ""
      } myarrow z-[1] left-0 -translate-x-8`}
    >
      <FontAwesomeIcon
        className="group-hover:text-white text-[17px] text-text-light-color"
        icon={faChevronLeft}
      />
    </div>
  );
};

export const CustomArrowNext = (clickHandler: () => void, hasNext: boolean) => {
  return (
    <div
      onClick={clickHandler}
      className={`${hasNext ? "group hover:bg-primary-color" : ""}`}
    ></div>
  );
};
export const CustomArrowPrev = (clickHandler: () => void, hasPrev: boolean) => {
  return (
    <div
      onClick={clickHandler}
      className={`${hasPrev ? "group hover:bg-primary-color" : ""} `}
    ></div>
  );
};

export const MyIndicator = (
  clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
  isSelected: boolean,
  index: number
) => {
  return (
    <div
      className={`${
        isSelected ? "bg-primary-color" : "bg-white"
      } rounded-full w-[15px] h-[15px] cursor-pointer shadow-[0_0_5px_rgba(0,0,0,0.3)]`}
      onClick={clickHandler}
    ></div>
  );
};
const Banner = () => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 gap-4 mt-[96px]">
      <div className="grid grid-cols-1 md:grid-cols-12 col-span-full gap-4">
        <div className="col-span-full lg:col-span-8 rounded-sm">
          <Carousel
            showStatus={false}
            showThumbs={false}
            transitionTime={150}
            autoPlay={true}
            infiniteLoop={true}
            showArrows={false}
            renderIndicator={MyIndicator}
            className="grid grid-flow-col"
          >
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-[200px] md:h-[310px]"
                alt="banner_thoi_trang_nu"
                src={banner_thoi_trang_nu_2}
                width={485}
                height={206}
                quality={100}
              />
            </article>
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-[200px] md:h-[310px]"
                alt="banner_thoi_trang_nu"
                src={sale_banner2}
                width={485}
                height={206}
                quality={100}
              />
            </article>
          </Carousel>
        </div>
        <div className="max-lg:hidden col-span-full grid grid-cols-12 gap-y-2 md:col-span-4">
          <div className="col-span-full bg-red-500 rounded-sm">
            <Image
              alt="banner"
              className="w-full h-full"
              src={banner_thoi_trang_nam}
            ></Image>
          </div>
          <div className="col-span-full bg-red-500 rounded-sm">
            <Image
              alt="banner"
              className="w-full h-full"
              src={banner_thoi_trang_nu}
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
