import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface TitleProps {
  children?: ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography
      className="text-3xl font-bold gap-x-2 w-full"
      component="h2"
      variant="h6"
      gutterBottom
    >
      {props.children}
    </Typography>
  );
}
