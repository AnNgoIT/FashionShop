import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface TitleProps {
  children?: ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography
      className="flex justify-center items-center text-3xl font-bold gap-x-2"
      component="h2"
      variant="h6"
      gutterBottom
    >
      {props.children}
    </Typography>
  );
}
