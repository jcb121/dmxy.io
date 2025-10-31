import { create } from "zustand";
import { Scene } from "./scenes";
import { persist } from "zustand/middleware";

export const useActiveScene = create<{
  activeScenes: Scene[];
  setActiveScenes: (scenes: Scene[]) => void;
}>()(
  persist(
    (set) => {
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
    },
    {
      name: "active-scene",
    }
  )
);
