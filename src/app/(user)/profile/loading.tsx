import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <div className="container grid grid-cols-12 py-4 max-md:px-4 mt-8 md:mt-12">
      <div className="col-span-full grid grid-cols-12 place-content-center">
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loading;
