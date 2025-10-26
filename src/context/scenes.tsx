import { create } from "zustand";
import { New_GenericProfile } from "./profiles";
import { NewGlobalValues } from "./globals";

export type Scene = {
  id: string;
  name: string;
  vars?: NewGlobalValues;
  new_profiles: Record<string, New_GenericProfile[]>;
};

export const SAMPLE_SCENE = () => ({
  fixtureGroups: [],
  id: crypto.randomUUID(),
  profiles: {},
  name: "New Scene",
  new_profiles: {},
});

export const useScenes = create<{ scenes: Scene[] }>(() => {
  return {
    scenes: [],
  };
});
