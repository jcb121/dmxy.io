import { create } from "zustand";
import { Scene } from "./scenes";

export const useActiveScene = create<{
  activeScenes: Scene[];
  setActiveScenes: (scenes: Scene[]) => void;
}>((set) => {
  return {
    activeScenes: [],
    setActiveScenes: (activeScenes: Scene[]) =>
      set((state) => {
        return {
          ...state,
          activeScenes: activeScenes.map((s) => ({ ...s })),
        };
      }),
  };
});
