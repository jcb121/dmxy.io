import { create } from "zustand";
import { MidiCallback } from "./midi";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChannelSimpleFunction } from "./fixtures";

export type UserEvent = ValueOf<UserEventMap>;

export type SetBeatLength = {
  function: MidiCallback.setBeatLength;
  globalVar: string | undefined; // this is BeatLength
  timeStamp: number | undefined;
};

export type SetScene = {
  function: MidiCallback.setScene;
  sceneId?: string;
};

export type CycleScene = {
  function: MidiCallback.cycleScene;
  scenes: string[];
  cycleName: string;
};

export type MergeScene = {
  function: MidiCallback.mergeScene;
  scene: string;
};

export type SetVar = {
  function: MidiCallback.setVar;
  varName: string;
  value: number;
  functionId?: string;
};
export type SetChannelValue = {
  function: MidiCallback.setChannelValue;
  channel: ChannelSimpleFunction;
  value: number;
  functionId?: string;
  type: "MAX" | "MIN";
};

export type UserEventMap = {
  [MidiCallback.setBeatLength]: SetBeatLength;
  [MidiCallback.setScene]: SetScene;
  [MidiCallback.cycleScene]: CycleScene;
  [MidiCallback.mergeScene]: MergeScene;
  [MidiCallback.setVar]: SetVar;
  [MidiCallback.setChannelValue]: SetChannelValue;
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
