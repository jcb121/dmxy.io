import { create } from "zustand";
import { Scene } from "./scenes";

export const useActiveScene = create<{
  activeScene?: Scene;
  activeScenes: Scene[];
  updateScene: (scene: Scene) => void;
  setActiveScenes: (scenes: Scene[]) => void;
}>((set) => {
  return {
    activeScenes: [],
    updateScene: (scene) =>
      set((state) => {
        const activeScenes = state.activeScenes;
        activeScenes[activeScenes.length - 1] = scene;

        return {
          ...state,
          activeScene: scene,
          activeScenes,
        };
      }),
    setActiveScenes: (activeScenes: Scene[]) =>
      set((state) => {
        return {
          ...state,
          activeScene:
            activeScenes.length > 0
              ? { ...activeScenes[activeScenes.length - 1] }
              : undefined,
          activeScenes: activeScenes.map((s) => ({ ...s })),
        };
      }),
  };
});
