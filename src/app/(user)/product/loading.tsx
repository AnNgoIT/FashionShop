import dynamic from "next/dynamic";

const LoadingComponent = dynamic(() => import("@/components/loading"));

const Loading = () => {
  return <LoadingComponent></LoadingComponent>;
};

export default Loading;
