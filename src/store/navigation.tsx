import React from "react";

import { usePathname } from "next/navigation";

type TargetsRouteToHandle = {
  [x: string]: (() => void) | undefined;
};

type NavigationEventContextValue = {
  addTargetRoute: (targetRoute: AddTargetRouteProps) => void;
};

type AddTargetRouteProps = {
  pathName: string;
  hookFunction: TargetsRouteToHandle["x"];
};

const NavigationEventContext = React.createContext<NavigationEventContextValue>(
  {} as NavigationEventContextValue
);

export const useNavigationEvent = () =>
  React.useContext(NavigationEventContext);

function NavigationEventProvider({ children }: React.PropsWithChildren) {
  const pathName = usePathname();

  const pathHistory = React.useRef<[string, string]>(["", pathName]);

  const [targetsRouteToHandle, setTargetsRouteToHandle] =
    React.useState<TargetsRouteToHandle>({});

  const addTargetRoute = ({ pathName, hookFunction }: AddTargetRouteProps) => {
    setTargetsRouteToHandle((prev) => ({ ...prev, [pathName]: hookFunction }));
  };

  React.useEffect(() => {
    const prev = pathHistory.current.at(0) as string;

    const isLeavingATargetRoute = targetsRouteToHandle[prev];

    if (isLeavingATargetRoute) isLeavingATargetRoute();

    pathHistory.current.push(pathHistory.current.shift() as string);

    pathHistory.current.unshift(pathName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <NavigationEventContext.Provider value={{ addTargetRoute }}>
      {children}
    </NavigationEventContext.Provider>
  );
}

export default NavigationEventProvider;
