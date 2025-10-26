import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export type NewGlobalValues<T = NewGlobalsValue> = {
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
};

// const active: Partial<Record<keyof typeof Colours, boolean>> = {};

export const useGlobals = create(
  persist<{
    values: NewGlobalValues;
    setGlobalValue: SetGlobalValue;
  }>(
    (set) => {
      return {
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
      // partialize: (state) => {
      //   return {
      //     values: state.values,
      //   };
      // },
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
