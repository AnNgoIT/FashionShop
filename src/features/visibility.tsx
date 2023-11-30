import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import React from "react";

const ShowHidePassword = ({
  showPassword,
  click,
  mousedownPassword,
}: {
  showPassword: boolean;
  click: any;
  mousedownPassword: any;
}) => {
  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={click}
      onMouseDown={mousedownPassword}
      edge="end"
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );
};

export default ShowHidePassword;
