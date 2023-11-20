import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";

export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?w=${width}`;
};

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 2,
  },
};
export const defaulResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};
export const MyRightArrow = ({ onClick, ...rest }: any) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className={`${
        true ? "group hover:bg-primary-color" : ""
      } myarrow right-0 translate-y-5 grid`}
    >
      <FontAwesomeIcon
        className="group-hover:text-white text-[17px] text-text-light-color"
        icon={faChevronRight}
      />
    </div>
  );
};
export const MyLeftArrow = ({ onClick, ...rest }: any) => {
  const {
    onMove,
    carouselState: { currentSlide, deviceType },
  } = rest;
  // onMove means if dragging or swiping in progress.
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className={`${
        true ? "group hover:bg-primary-color" : ""
      } myarrow left-0 translate-y-5 grid`}
    >
      <FontAwesomeIcon
        className="group-hover:text-white text-[17px] text-text-light-color"
        icon={faChevronLeft}
      />
    </div>
  );
};

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 4,
};

export const modalOrderDetailStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "80vw",
    lg: 500,
  },
  height: "80vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 2,
};
