import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const LoadingComponent = () => {
  return (
    <div className="container grid grid-cols-12 py-4 max-md:px-4 mt-8 md:mt-12 min-h-full">
      <div className="col-span-full grid place-items-center">
        <CircularProgress />
      </div>
    </div>
  );
};

export default LoadingComponent;
