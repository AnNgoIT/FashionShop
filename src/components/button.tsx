"use client";
import Button from "@mui/material/Button";
import React, { ReactNode } from "react";
const NavigateButton = ({
  children,
  onClick,
}: {
  children: ReactNode | string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        textTransform: "capitalize",
        background: "#639df1",
        fontSize: "1rem",
        lineHeight: "1.5rem",
        fontWeight: "500",
        padding: "14px 28px",
        color: "white",
        display: "flex",

        justifyContent: "space-center",
        alignItems: "center",
        // marginTop: "24px",
      }}
      className="py-3.5 px-7 font-medium text-base bg-primary-color text-white
      hover:!bg-text-light-color rounded-[0.25rem] capitalize flex justify-center items-center truncate"
    >
      {children}
    </Button>
  );
};

export default NavigateButton;

export const QuantityButton = ({
  children,
  onClick,
  onMouseUp,
  onMouseDown,
}: {
  children: ReactNode | string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  return (
    <button
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      className="border border-border-color text-text-light-color py-1.5 px-3
        hover:bg-primary-color hover:text-white transition-all"
    >
      {children}
    </button>
  );
};
