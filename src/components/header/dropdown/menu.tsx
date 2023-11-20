"use client";
import React, { ReactElement } from "react";
import { bindHover } from "material-ui-popup-state";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { bindPopper, usePopupState } from "material-ui-popup-state/hooks";
import { styled } from "@mui/material/styles";
import ClientOnly from "@/components/client-only";

const StyledPopper = styled(Popper)(({ theme }) => ({
  // You can replace with `PopperUnstyled` for lower bundle size.
  zIndex: 1,
  maxWidth: "150px",
  width: "100%",
  '&[data-popper-placement*="bottom"] .arrow': {
    top: -1,
    left: 0,
    marginTop: "-0.9em",
    width: "3em",
    height: "1em",
    "&::before": {
      borderWidth: "0 1em 1em 1em",
      borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
    },
  },
  '&[data-popper-placement*="top"] .arrow': {
    bottom: 0,
    left: 0,
    marginBottom: "-0.9em",
    width: "3em",
    height: "1em",
    "&::before": {
      borderWidth: "1em 1em 0 1em",
      borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
    },
  },
  '&[data-popper-placement*="right"] .arrow': {
    left: 0,
    marginLeft: "-0.9em",
    height: "3em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 1em 1em 0",
      borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
    },
  },
  '&[data-popper-placement*="left"] .arrow': {
    right: 0,
    marginRight: "-0.9em",
    height: "3em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 0 1em 1em",
      borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
    },
  },
}));

const Menu = ({
  buttonChildren,
  dropdownContent,
  arrowPos,
}: {
  buttonChildren?: any;
  dropdownContent?: ReactElement;
  arrowPos?: string;
}) => {
  const popupState = usePopupState({
    variant: "popper",
    popupId: "demoPopper",
  });

  return (
    <>
      <Button
        sx={{
          p: 1,
          fontSize: 20,
          color: "#333",
        }}
        className="hover:bg-transparent transition-all"
        {...bindHover(popupState)}
      >
        {buttonChildren}
      </Button>
      <StyledPopper
        className="relative z-20"
        {...bindPopper(popupState)}
        placement="bottom-end"
        modifiers={[
          {
            name: "arrow",
            enabled: true,
            // options: {
            //   element: arrowRef,
            // },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <div className="w-full">
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  fontSize: 8,
                  "&::before": {
                    content: '""',
                    margin: "auto",
                    display: "block",
                    width: 0,
                    height: 0,
                    transform: {
                      xs: `translateX(${
                        arrowPos && !arrowPos.includes("70px")
                          ? arrowPos
                          : "105px"
                      })`,
                      md: `translateX(${arrowPos ? arrowPos : "105px"})`,
                    },
                    borderLeftWidth: "8px",
                    borderRightWidth: "8px",
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                  },
                }}
                className={`${dropdownContent ? "arrow" : ""} `}
                // ref={setArrowRef}
              ></Box>
              {dropdownContent}
            </div>
          </Fade>
        )}
      </StyledPopper>
    </>
  );
};

export default Menu;
