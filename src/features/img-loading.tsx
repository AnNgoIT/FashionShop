import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Height } from "@mui/icons-material";
import { createTheme, styled } from "@mui/material/styles";

export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?w=${width}`;
};

export const getUrlExtension = (url: any) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

export const onImageEdit = async (imgUrl: string) => {
  var imgExt = getUrlExtension(imgUrl);

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  return new File([blob], "profileImage." + imgExt, {
    type: blob.type,
  });
};

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 4,
  },
};
export const defaulResponsive3 = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 3,
  },
};
export const defaulResponsive8 = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 8,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 768, min: 500 },
    items: 3,
  },
};

export const defaulResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1230 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1229, min: 768 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 2,
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
      } myarrow right-0 translate-y-5 grid z-0`}
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
      } myarrow left-0 translate-y-5 grid z-0`}
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

  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 3.5,
};

export const modalProductItemStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,

  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 3.5,
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
  maxHeight: "79vh",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 2,
};

export const modalOrderChangeStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "80vw",
    lg: 500,
  },
  height: "fit-content",
  overflow: "auto",
  bgcolor: "background.paper",
  borderRadius: "0.25rem",
  boxShadow: 24,
  p: 2,
};

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1230,
    },
  },
});
