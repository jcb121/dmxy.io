import { createContext, useContext } from "react";

export interface StageTransform {
  toDisplay: (x: number, y: number) => { left: string; top: string };
}

export const StageTransformContext = createContext<StageTransform>({
  toDisplay: (x, y) => ({ left: `${x}px`, top: `${y}px` }),
});

export const useStageTransform = () => useContext(StageTransformContext);
