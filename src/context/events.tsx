import { create } from "zustand";
import { MidiCallback } from "./midi";
import { NewGlobalsValue } from "./globals";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserEvent = ValueOf<UserEventMap>;

export type SetBeatLength = {
  function: MidiCallback.setBeatLength;
  globalVar: string | undefined; // this is BeatLength
  timeStamp: number | undefined;
};

export type SetColour = {
  function: MidiCallback.setColour;
  colour?: string;
};

export type SetScene = {
  function: MidiCallback.setScene;
  sceneId?: string;
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

export type UserEventMap = {
  [MidiCallback.setBeatLength]: SetBeatLength;
  [MidiCallback.setColour]: SetColour;
  [MidiCallback.setScene]: SetScene;
  [MidiCallback.removeScene]: removeScene;
  [MidiCallback.setState]: setState;
};

type ValueOf<T> = T[keyof T];

export type MapToFunction<T = object> = {
  [key in keyof T]: (a: T[key]) => void;
};

export const useEvents = create(
  persist<{
    editMode: boolean;
    buttonFuncs: Record<number, ValueOf<UserEventMap> | undefined>;
    setEditMode: (v: boolean) => void;
    setButtonFuncs: (id: number, val: UserEvent) => void;
  }>(
    (set) => {
      return {
        buttonFuncs: {},
        setButtonFuncs: (id: number, val: ValueOf<UserEventMap>) =>
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
