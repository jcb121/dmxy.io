import { create } from "zustand";
import {
  CustomMidiEvent,
  MIDIMessageEventWithData,
  MidiCallback,
  MidiTrigger,
} from "./midi";
import { useEffect } from "react";
import { createJSONStorage, persist } from "zustand/middleware";
import { animateColour, getRGB } from "../utils";

export enum GlobalTypes {
  byte = "byte",
  colour = "colour",
  time = "time",
}

// export enum Global

export type GlobalsValue =
  | {
      type: GlobalTypes.byte;
      value: number;
    }
  | {
      type: GlobalTypes.colour;
      value: string;
    }
  | {
      type: GlobalTypes.time;
      value: number;
    };

export const GLOBAL_VARS: Record<string, GlobalsValue> = {
  Blue: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Red: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Green: {
    type: GlobalTypes.byte,
    value: 255,
  },
  White: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Beatlength: {
    type: GlobalTypes.time,
    value: 140,
  },
  Brightness: {
    type: GlobalTypes.byte,
    value: 128,
  },
  flashBrightness: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Strobe: {
    type: GlobalTypes.byte,
    value: 0,
  },
};

let lastClickTime: number | undefined;
let lastClickTimeout: number | undefined;

export const useGlobals = create(
  persist<{
    functions: Record<
      MidiCallback,
      (e: MIDIMessageEventWithData, m: MidiTrigger) => void
    >;
    values: Record<string, GlobalsValue>;
    midiTriggers: Record<string, MidiTrigger>;
    setMidiTrigger: (key: string, midiTrigger: MidiTrigger) => void;
    setGlobalValue: (key: string, value: number | string) => void;
  }>(
    (set) => {
      return {
        functions: {
          turnOff: () => {},
          turnOn: () => {},
          setBeatLength: (e) => {
            lastClickTimeout && clearTimeout(lastClickTimeout);
            if (lastClickTime) {
              const seconds = e.timeStamp - lastClickTime;
              set((state) => ({
                ...state,
                values: {
                  ...state.values,
                  Beatlength: {
                    type: GlobalTypes.time,
                    value: Math.round(seconds),
                  },
                },
              }));
            }
            lastClickTime = e.timeStamp;
            lastClickTimeout = setTimeout(() => {
              lastClickTime = undefined;
            }, 5000);
          },
          setState: (e, m) => {
            const [, , value] = e.data;

            set((state) => ({
              ...state,
              values: {
                ...state.values,
                [m.key]: {
                  type: GlobalTypes.byte,
                  value: value * 2,
                },
              },
            }));
          },
          setColour: (e) => {
            const [, , value] = e.data;

            const third = 127 / 2;
            const state = value / third;
            const frame = Math.floor(state);

            let res = "0000ff";
            if (frame === 0) {
              res = animateColour("ff0000", "00ff00", 1, state - frame);
            } else if (frame === 1) {
              res = animateColour("00ff00", "0000ff", 1, state - frame);
            }

            const [Red, Green, Blue] = getRGB(res);

            set((state) => ({
              ...state,
              values: {
                ...state.values,
                Red: {
                  type: GlobalTypes.byte,
                  value: Red,
                },
                Green: {
                  type: GlobalTypes.byte,
                  value: Green,
                },
                Blue: {
                  value: Blue,
                  type: GlobalTypes.byte,
                },
              },
            }));
          },
        },
        values: GLOBAL_VARS,
        midiTriggers: {},
        setMidiTrigger: (key, midiTrigger) =>
          set((state) => ({
            ...state,
            midiTriggers: {
              ...state.midiTriggers,
              [key]: midiTrigger,
            },
          })),
        setGlobalValue: (key, value) => {
          GLOBAL_VARS[key].value = value;
        },
      };
    },
    {
      // @ts-expect-error Weird type
      partialize: (state) => {
        return {
          values: state.values,
          midiTriggers: state.midiTriggers,
        };
      },
      name: "global-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useMidiListener = () => {
  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  useEffect(() => {
    const event = (e: Event) => {
      // console.log("Got a midi event...", midiTriggers);
      const { deviceId, controlId, value } = (e as CustomMidiEvent).data;

      const foundKey = Object.keys(midiTriggers).find((key) => {
        return (
          midiTriggers &&
          midiTriggers[key].controlId == controlId &&
          midiTriggers[key].deviceId === deviceId
        );
      });

      if (foundKey) {
        setGlobalValue(foundKey, value * 2);
      }
    };
    document.addEventListener("CustomMidiEvent", event);
    // document.removeEventListener("CustomMidiEvent", event);
  }, [midiTriggers, setGlobalValue]);
};
