import { create } from "zustand";
import { CustomMidiEvent, MidiTrigger } from "./midi";
import { useEffect } from "react";

export const useGlobals = create<{
  globals: Record<string, number>;
  midiTriggers: Record<string, MidiTrigger>;
  setMidiTrigger: (key: string, midiTrigger: MidiTrigger) => void;
  setGlobalValue: (key: string, value: number) => void;
  // lastMidiEvent?: MidiTrigger;
}>((set) => {
  return {
    globals: {
      Tempo: 140,
      Brightness: 128,
      flashBrightness: 255,
      Strobe: 128,
    },
    midiTriggers: {},
    setMidiTrigger: (key, midiTrigger) =>
      set((state) => ({
        ...state,
        midiTriggers: {
          ...state.midiTriggers,
          [key]: midiTrigger,
        },
      })),
    setGlobalValue: (key, value) =>
      set((state) => ({
        ...state,
        // lastMidiEvent: lastMidiEvent || state.lastMidiEvent,
        globals: {
          ...state.globals,
          [key]: value,
        },
      })),
  };
});

export const useMidiListener = () => {
  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  useEffect(() => {
    const event = (e) => {
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
  }, [midiTriggers]);
};
