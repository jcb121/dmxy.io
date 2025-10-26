import { create } from "zustand";
import { MidiTrigger } from "./midi";
import { createJSONStorage, persist } from "zustand/middleware";

export const useMidiTriggers = create(
  persist<{
    midiTriggers: Record<string, MidiTrigger>;
    setMidiTrigger: (id: string, midiTrigger: MidiTrigger) => void;
  }>(
    (set) => {
      return {
        midiTriggers: {},
        setMidiTrigger: (key, midiTrigger) =>
          set((state) => ({
            ...state,
            midiTriggers: {
              ...state.midiTriggers,
              [key]: midiTrigger,
            },
          })),
      };
    },
    {
      name: "midi-events", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
