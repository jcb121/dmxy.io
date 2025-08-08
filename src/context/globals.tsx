import { create } from "zustand";
import { MidiCallback, MidiEventTypes } from "./midi";
import { createJSONStorage, persist } from "zustand/middleware";
import { getRGB } from "../utils";
import { MapToFunction, UserEvent, UserEventMap } from "./events";
import { useZones } from "./zones";
import { useActiveScene } from "./active-scene";
import { Colours } from "../colours";

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
  globalBlue: {
    type: GlobalTypes.byte,
    value: 255,
  },
  globalRed: {
    type: GlobalTypes.byte,
    value: 255,
  },
  globalGreen: {
    type: GlobalTypes.byte,
    value: 255,
  },
  globalWhite: {
    type: GlobalTypes.byte,
    value: 255,
  },
  Beatlength: {
    type: GlobalTypes.time,
    value: 1000,
  },
  Intensity: {
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
// const active: Partial<Record<keyof typeof Colours, boolean>> = {};

export const useGlobals = create(
  persist<{
    apply: (a: UserEvent, T: MidiEventTypes) => void;
    handlers: MapToFunction<UserEventMap, MidiEventTypes>;
    values: NewGlobalValues;
    setGlobalValue: SetGlobalValue;
    activeVenueId?: string;
    setActiveVenueId: (venueId: string) => void;
  }>(
    (set, get) => {
      return {
        apply: (e: UserEvent, t: MidiEventTypes) => {
          const handlers = get().handlers;
          if (e.function === MidiCallback.setBeatLength) {
            handlers.setBeatLength(e, t);
          } else if (e.function === MidiCallback.playColour) {
            handlers.playColour(e, t);
          } else if (e.function === MidiCallback.setColour) {
            handlers.setColour(e, t);
          } else if (e.function === MidiCallback.setScene) {
            handlers.setScene(e, t);
          } else if (e.function === MidiCallback.setState) {
            handlers.setState(e, t);
          } else if (e.function === MidiCallback.removeScene) {
            handlers.removeScene(e, t);
          } else if (e.function === MidiCallback.cycleScene) {
            handlers.cycleScene(e, t);
          } else if (e.function === MidiCallback.toggleColour) {
            handlers.toggleColour(e, t);
          } else if (e.function === MidiCallback.setRenderMode) {
            handlers.setRenderMode(e, t);
          } else if (e.function === MidiCallback.changeZone) {
            handlers.changeZone(e, t);
          }
        },
        handlers: {
          changeZone: (e, type) => {
            if (type === MidiEventTypes.onPress) {
              const { activeZone, zones, setActiveZone } = useZones.getState();
              const index = (activeZone && zones.indexOf(activeZone)) || 0;
              if (e.reverse) {
                if (index <= 0) {
                  setActiveZone(zones[zones.length - 1]);
                } else {
                  setActiveZone(zones[index - 1]);
                }
              } else {
                if (index >= zones.length - 1) {
                  setActiveZone(zones[0]);
                } else {
                  setActiveZone(zones[index + 1]);
                }
              }
            }
          },
          setRenderMode: (e) => {
            const { activeZone } = useZones.getState();

            console.log("SET THE RENDER MODE", e, activeZone);
          },
          toggleColour: (e, type) => {
            const { activeScene, updateScene } = useActiveScene.getState();
            const { activeZone } = useZones.getState();
            if (!activeZone || !activeScene) return;

            if (type == MidiEventTypes.onHoldRelease) {
              return updateScene({
                ...activeScene,
                profiles: {
                  [activeZone]: [e.profileId],
                },
              });
            }

            if (type === MidiEventTypes.onRelease) {
              if (activeScene.profiles[activeZone]?.includes(e.profileId)) {
                updateScene({
                  ...activeScene,
                  profiles: {
                    ...activeScene.profiles,
                    [activeZone]: activeScene.profiles[activeZone]?.filter(
                      (a) => a != e.profileId
                    ),
                  },
                });
              } else {
                updateScene({
                  ...activeScene,
                  profiles: {
                    ...activeScene.profiles,
                    [activeZone]: [
                      ...(activeScene.profiles[activeZone] || []),
                      e.profileId,
                    ],
                  },
                });
              }
            }
          },
          cycleScene: (e, type) =>
            type !== MidiEventTypes.onPress &&
            set((state) => {
              const sceneAnimationIndex = `_${e.cycleName}_sceneAnimationIndexKey`;
              const sceneAnimation = `_${e.cycleName}_sceneAnimationKey`;
              const sAIVar = state.values[sceneAnimationIndex];
              const sceneIndex =
                sAIVar !== undefined && sAIVar.type === GlobalTypes.byte
                  ? sAIVar.value
                  : -1;
              const scenes = e.scenes;
              const nextSceneIndex = scenes[sceneIndex + 1]
                ? sceneIndex + 1
                : 0;

              return {
                ...state,
                values: {
                  ...state.values,
                  [sceneAnimationIndex]: {
                    value: nextSceneIndex,
                    type: GlobalTypes.byte,
                  },
                  [sceneAnimation]: {
                    type: GlobalTypes.scene,
                    value: scenes,
                  },
                  ActiveScene: {
                    type: GlobalTypes.scene,
                    value: [scenes[nextSceneIndex]],
                  },
                },
              };
            }),
          setBeatLength: (e, type) => {
            if (type !== MidiEventTypes.onPress) return;
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
          // sets the global colour
          setColour: (e) => {
            if (!e.colour) return;
            const { handlers } = get();
            const { activeScene } = useActiveScene.getState();

            if (activeScene?.id !== e.sceneId) {
              handlers.setScene(
                {
                  function: MidiCallback.setScene,
                  remove: false,
                  sceneId: e.sceneId,
                },
                MidiEventTypes.onPress
              );
            }

            const [Red, Green, Blue] = getRGB(e.colour);
            set((state) => ({
              ...state,
              values: {
                ...state.values,
                globalRed: {
                  type: GlobalTypes.byte,
                  value: Red,
                },
                globalGreen: {
                  type: GlobalTypes.byte,
                  value: Green,
                },
                globalBlue: {
                  value: Blue,
                  type: GlobalTypes.byte,
                },
              },
            }));
          },
          playColour: (e, type) => {
            if (!e.colour) return;
            if (!e.sceneId) return;
            const { handlers } = get();

            if (type === MidiEventTypes.onPress) {
              handlers.setColour(
                {
                  colour: Colours[e.colour],
                  function: MidiCallback.setColour,
                  sceneId: e.sceneId,
                },
                MidiEventTypes.onPress
              );
            } else if (
              type === MidiEventTypes.onRelease ||
              type === MidiEventTypes.onHoldRelease
            ) {
              // active[e.colour] = false;
            }
          },
          setScene: (e, type) => {
            if (e.remove && type === MidiEventTypes.onRelease) {
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
            }

            if (type !== MidiEventTypes.onPress) return;
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
          removeScene: (e, type) => {
            if (type !== MidiEventTypes.onPress) return;

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
        setActiveVenueId: (activeVenueId) =>
          set((state) => ({ ...state, activeVenueId })),
      };
    },
    {
      // @ts-expect-error error for some reason...
      partialize: (state) => {
        return {
          values: state.values,
          activeVenueId: state.activeVenueId,
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
