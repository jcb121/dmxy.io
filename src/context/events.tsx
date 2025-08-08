import { create } from "zustand";
import { MidiCallback } from "./midi";
import { NewGlobalsValue } from "./globals";
import { createJSONStorage, persist } from "zustand/middleware";
import { Colours } from "../colours";

export type UserEvent = ValueOf<UserEventMap>;

export type SetBeatLength = {
  function: MidiCallback.setBeatLength;
  globalVar: string | undefined; // this is BeatLength
  timeStamp: number | undefined;
};

export type SetColour = {
  function: MidiCallback.setColour;
  colour?: string;
  sceneId?: string
};

export type PlayColour = {
  function: MidiCallback.playColour;
  colour?: keyof typeof Colours;
  sceneId?: string
};

export type SetScene = {
  function: MidiCallback.setScene;
  sceneId?: string;
  remove: boolean,
};
export type removeScene = {
  function: MidiCallback.removeScene;
  sceneId?: string;
};

export type setState = {
  function: MidiCallback.setState;
  globalVar?: string;
  payload?: NewGlobalsValue[keyof NewGlobalsValue];
};

export type ToggleColour = {
  function: MidiCallback.toggleColour;
  profileId: string;
};

export enum RenderModes {
  // still = 'still',
  cycle = "cycle",
  rotate = "rotate",
  random = "random",
}

export type SetRenderMode = {
  function: MidiCallback.setRenderMode;
  renderMode: RenderModes;
};

export type CycleScene = {
  function: MidiCallback.cycleScene;
  scenes: string[];
  cycleName: string;
};

export type ChangeZone = {
  function: MidiCallback.changeZone;
  reverse: boolean;
};

export type UserEventMap = {
  [MidiCallback.setBeatLength]: SetBeatLength;
  [MidiCallback.setColour]: SetColour;
  [MidiCallback.playColour]: PlayColour;
  [MidiCallback.setScene]: SetScene;
  [MidiCallback.removeScene]: removeScene;
  [MidiCallback.setState]: setState;
  [MidiCallback.cycleScene]: CycleScene;
  [MidiCallback.toggleColour]: ToggleColour;
  [MidiCallback.setRenderMode]: SetRenderMode;
  [MidiCallback.changeZone]: ChangeZone;
};

type ValueOf<T> = T[keyof T];

export type MapToFunction<T, Z> = {
  [key in keyof T]: (a: T[key], b: Z) => void;
};

export const useEvents = create(
  persist<{
    editMode: boolean;
    buttonFuncs: Record<string, ValueOf<UserEventMap> | undefined>;
    setEditMode: (v: boolean) => void;
    setButtonFuncs: (id: string, val: UserEvent) => void;
  }>(
    (set) => {
      return {
        buttonFuncs: {},
        setButtonFuncs: (id: string, val: ValueOf<UserEventMap>) =>
          set((state) => ({
            ...state,
            buttonFuncs: {
              ...state.buttonFuncs,
              [id]: val,
            },
          })),
        editMode: true,
        setEditMode: (val) => set((state) => ({ ...state, editMode: val })),
      };
    },
    {
      name: "event-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
