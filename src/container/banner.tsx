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
  sale_banner2,
} from "@/assests/images";
import { imageLoader } from "@/features/img-loading";
import Image from "next/image";
import { SaleBanner } from "@/features/types";
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
const Banner = ({ banners }: { banners: SaleBanner[] }) => {
  return (
    <section className="container grid grid-cols-12 p-4 max-md:px-4 gap-4 mt-[96px]">
      <div className="grid grid-cols-1 md:grid-cols-12 col-span-full gap-4">
        <div className="col-span-full lg:col-span-8 rounded-sm">
          <Carousel
            showStatus={false}
            showThumbs={false}
            swipeable={true}
            transitionTime={150}
            // autoPlay={true}
            infiniteLoop={true}
            // showArrows={false}
            renderIndicator={MyIndicator}
            className="grid grid-flow-col"
          >
            {banners &&
              banners.slice(2, 5).map((banner) => {
                return (
                  <article
                    key={banner.bannerId}
                    className="grid grid-flow-col gap-x-4"
                  >
                    <Image
                      loader={imageLoader}
                      blurDataURL={banner.image}
                      placeholder="blur"
                      className="h-[190px] lg:h-[310px] w-full"
                      alt="banner_thoi_trang_nam"
                      src={banner.image}
                      width={485}
                      height={206}
                      quality={100}
                    />
                  </article>
                );
              })}
            {/* <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="h-[190px] lg:h-[310px] w-full"
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
                className="h-[190px] lg:h-[310px] w-full"
                alt="sale_banner2"
                src={sale_banner2}
                width={485}
                height={206}
                quality={100}
              />
            </article> */}
          </Carousel>
        </div>
        <div className="max-lg:hidden col-span-full grid grid-cols-12 gap-y-2 md:col-span-4">
          <div className="col-span-full rounded-sm">
            <Image
              alt="banner_thoi_trang_nam"
              loader={imageLoader}
              placeholder="blur"
              width={430}
              height={152}
              className="w-full lg:h-[151px]"
              quality={100}
              src={banner_thoi_trang_nam}
            ></Image>
          </div>
          <div className="col-span-full rounded-sm">
            <Image
              alt="banner_thoi_trang_nu"
              loader={imageLoader}
              placeholder="blur"
              width={430}
              height={151}
              className="w-full lg:h-[151px]"
              quality={100}
              src={banner_thoi_trang_nu}
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
