import { create } from "zustand";
import { MidiCallback } from "./midi";
import { createJSONStorage, persist } from "zustand/middleware";
import { getRGB } from "../utils";
import { MapToFunction, UserEvent, UserEventMap } from "./events";

export enum GlobalTypes {
  byte = "byte",
  colour = "colour",
  time = "time",
  scene = "scene",
}

export type NewGlobalsValue = {
  [GlobalTypes.byte]: {
    type: GlobalTypes.byte;
    value: number;
  };
  [GlobalTypes.colour]: {
    type: GlobalTypes.colour;
    value: string;
  };
  [GlobalTypes.scene]: {
    type: GlobalTypes.scene;
    value: string[];
  };
  [GlobalTypes.time]: {
    type: GlobalTypes.time;
    value: number;
  };
};
type SetGlobalValue<T = NewGlobalsValue> = (
  name: string,
  // a: keyof T,
  payload: T[keyof T]
) => void;

type NewGlobalValues<T = NewGlobalsValue> = {
  [global: string]: T[keyof T];
};

export const GLOBAL_VARS: NewGlobalValues = {
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
    value: 1000,
  },
  Brightness: {
    type: GlobalTypes.byte,
    value: 255,
  },
  flashBrightness: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Strobe: {
    type: GlobalTypes.byte,
    value: 0,
  },
  Fade: {
    type: GlobalTypes.byte,
    value: 50,
  },
  FadeGap: {
    type: GlobalTypes.byte,
    value: 0,
  },
  ActiveScene: {
    type: GlobalTypes.scene,
    value: [],
  },
};

let lastClickTime: number | undefined;
let lastClickTimeout: number | undefined;

export const useGlobals = create(
  persist<{
    apply: (a: UserEvent) => void;
    handlers: MapToFunction<UserEventMap>;
    values: NewGlobalValues;
    setGlobalValue: SetGlobalValue;
  }>(
    (set, get) => {
      return {
        apply: (e: UserEvent) => {
          const handlers = get().handlers;
          if (e.function === MidiCallback.setBeatLength) {
            handlers.setBeatLength(e);
          } else if (e.function === MidiCallback.setColour) {
            handlers.setColour(e);
          } else if (e.function === MidiCallback.setScene) {
            handlers.setScene(e);
          } else if (e.function === MidiCallback.setState) {
            handlers.setState(e);
          } else if (e.function === MidiCallback.removeScene) {
            handlers.removeScene(e);
          }
        },
        handlers: {
          setBeatLength: (e) => {
            console.log(e);
            lastClickTimeout && clearTimeout(lastClickTimeout);
            if (lastClickTime && e.timeStamp) {
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
          setColour: (e) => {
            if (!e.colour) return;
            const [Red, Green, Blue] = getRGB(e.colour);
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
          setScene: (e) => {
            set((state) =>
              e.sceneId
                ? {
                    ...state,
                    values: {
                      ...state.values,
                      ["ActiveScene"]: {
                        value: [
                          ...(state.values["ActiveScene"]?.value as string[]),
                          e.sceneId,
                        ],
                        type: GlobalTypes.scene,
                      },
                    },
                  }
                : state
            );
          },
          removeScene: (e) => {
            set((state) => {
              return {
                ...state,
                values: {
                  ...state.values,
                  ["ActiveScene"]: {
                    value: (
                      state.values["ActiveScene"]?.value as string[]
                    ).filter((s) => s !== e.sceneId),
                    type: GlobalTypes.scene,
                  },
                },
              };
            });
          },
          setState: (e) => {
            const { globalVar, payload } = e;
            if (!globalVar || !payload) return;

            set((state) => ({
              ...state,
              values: {
                ...state.values,
                [globalVar]: payload,
              },
            }));
          },
        },
        // functions: {
        //   setColour: (e) => {
        //     const [, , value] = e.data;

        //     const third = 127 / 2;
        //     const state = value / third;
        //     const frame = Math.floor(state);

        //     let res = "0000ff";
        //     if (frame === 0) {
        //       res = animateColour("ff0000", "00ff00", 1, state - frame);
        //     } else if (frame === 1) {
        //       res = animateColour("00ff00", "0000ff", 1, state - frame);
        //     }

        //     const [Red, Green, Blue] = getRGB(res);

        //     set((state) => ({
        //       ...state,
        //       values: {
        //         ...state.values,
        //         Red: {
        //           type: GlobalTypes.byte,
        //           value: Red,
        //         },
        //         Green: {
        //           type: GlobalTypes.byte,
        //           value: Green,
        //         },
        //         Blue: {
        //           value: Blue,
        //           type: GlobalTypes.byte,
        //         },
        //       },
        //     }));
        //   },
        // },
        values: GLOBAL_VARS,
        setGlobalValue: (key, payload) => {
          // if(GLOBAL_VARS[key])
          // GLOBAL_VARS[key].value = value;
          set((state) => ({
            ...state,
            values: {
              ...state.values,
              [key]: payload,
            },
          }));
        },
      };
    },
    {
      // @ts-expect-error error for some reason...
      partialize: (state) => {
        return {
          values: state.values,
          // midiTriggers: state.midiTriggers,
        };
      },
      name: "global-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

// export const useMidiListener = () => {
//   const midiTriggers = useGlobals((state) => state.midiTriggers);
//   const setGlobalValue = useGlobals((state) => state.setGlobalValue);

//   useEffect(() => {
//     const event = (e: Event) => {
//       // console.log("Got a midi event...", midiTriggers);
//       const { deviceId, controlId, value } = (e as CustomMidiEvent).data;

//       const foundKey = Object.keys(midiTriggers).find((key) => {
//         return (
//           midiTriggers &&
//           midiTriggers[key].controlId == controlId &&
//           midiTriggers[key].deviceId === deviceId
//         );
//       });

//       if (foundKey) {
//         setGlobalValue(foundKey, value * 2);
//       }
//     };
//     document.addEventListener("CustomMidiEvent", event);
//     // document.removeEventListener("CustomMidiEvent", event);
//   }, [midiTriggers, setGlobalValue]);
// };
