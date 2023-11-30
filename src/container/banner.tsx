import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { main_banner1, main_banner2, main_banner3 } from "@/assests/images";
import Box from "@mui/material/Box";
import { imageLoader } from "@/features/img-loading";
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
      } myarrow left-0 -translate-x-8`}
    >
      <FontAwesomeIcon
        className="group-hover:text-white text-[17px] text-text-light-color"
        icon={faChevronLeft}
      />
    </div>
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
      } rounded-full w-[15px] h-[15px] cursor-pointer block md:hidden shadow-[0_0_5px_rgba(0,0,0,0.3)]`}
      onClick={clickHandler}
    ></div>
  );
};
const Banner = () => {
  return (
    <Box
      sx={{
        maxHeight: {
          xs: 280,
          sm: 350,
          md: 450,
          lg: 550,
        },
        height: 480,
        width: "100%",
      }}
    >
      <Image
        loader={imageLoader}
        src={main_banner3}
        alt="mainBanner3"
        placeholder="blur"
        className="w-full h-full"
        width={400}
        height={0}
      />
      <section className="grid grid-cols-12 p-4 max-md:px-4 gap-4 ssm:-translate-y-14 sm:-translate-y-20 md:-translate-y-28 xl:-translate-y-40">
        <div className="col-span-full md:col-span-8 md:col-start-3">
          <Carousel
            showStatus={false}
            showThumbs={false}
            transitionTime={150}
            autoPlay={true}
            infiniteLoop={true}
            renderIndicator={MyIndicator}
            renderArrowPrev={MyArrowPrev}
            renderArrowNext={MyArrowNext}
            className="hidden lg:grid grid-flow-col"
          >
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner1"
                src={main_banner1}
              />
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner2"
                src={main_banner2}
              />
            </article>
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner1"
                src={main_banner1}
              />
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner2"
                src={main_banner2}
              />
            </article>
          </Carousel>
          <Carousel
            showStatus={false}
            showThumbs={false}
            transitionTime={150}
            autoPlay={true}
            infiniteLoop={true}
            renderIndicator={MyIndicator}
            renderArrowPrev={MyArrowPrev}
            renderArrowNext={MyArrowNext}
            className=" hidden max-lg:grid grid-flow-col"
          >
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner1"
                src={main_banner1}
              />
            </article>
            <article className="grid grid-flow-col gap-x-4">
              <Image
                loader={imageLoader}
                placeholder="blur"
                className="rounded-lg max-h-[245px]"
                alt="banner2"
                src={main_banner2}
              />
            </article>
          </Carousel>
        </div>
      </section>
    </Box>
  );
};

export default Banner;
