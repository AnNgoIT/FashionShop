// import LoadingComponent from "@/components/loading";
import dynamic from "next/dynamic";

const LoadingComponent = dynamic(() => import("@/components/loading"));
const Loading = () => {
  return <LoadingComponent />;
};

export default Loading;
