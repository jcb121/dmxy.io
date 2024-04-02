import React, { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserEventMap } from "./events";
import { useGlobals } from "./globals";
import { animateColour } from "../utils";

// function listInputsAndOutputs(midiAccess: MIDIAccess) {
//   for (const entry of midiAccess.inputs) {
//     const input = entry[1];
//     console.log(
//       `Input port [type:'${input.type}']` +
//         ` id:'${input.id}'` +
//         ` manufacturer:'${input.manufacturer}'` +
//         ` name:'${input.name}'` +
//         ` version:'${input.version}'`
//     );
//     input.onmidimessage = (message) => {
//       console.log(message, message.data);
//     };
//   }

//   for (const entry of midiAccess.outputs) {
//     const output = entry[1];
//     console.log(
//       `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
//     );
//   }
// }

// function onMIDIFailure(msg: string) {
//   console.error(`Failed to get MIDI access - ${msg}`);
// }

export type MIDIMessageEventWithData = MIDIMessageEvent & {
  currentTarget: EventTarget & {
    id: string;
    name: string;
  };
  data: [number, number, number];
};

export const useMidiTriggers = create(
  persist<{
    midiTriggers: Record<string, MidiTrigger>;
    setMidiTrigger: (key: string, midiTrigger: MidiTrigger) => void;
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

export const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  // const [MIDIInput, setMIDIInput] = useState<MIDIInput>();

  const applyAction = useGlobals((state) => state.apply);

  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const eventHandlerRef = useRef<(e: MIDIMessageEventWithData) => void>();

  const [mIDIInputs, setMIDIInputs] = useState<MIDIInputMap>();

  useEffect(() => {
    (async () => {
      const result = await navigator.permissions.query({
        // @ts-expect-error Missing type
        name: "midi",
        sysex: true,
      });
      console.log("MIDI RESULT", result.state);
      const midiAccess = await navigator.requestMIDIAccess();
      setMIDIInputs(midiAccess.inputs);
    })();
  }, []);

  useEffect(() => {
    if (!mIDIInputs) return;

    const eventHandler = (e: MIDIMessageEventWithData) => {
      const deviceId = e.currentTarget?.id as string;
      const [type, controlId, value] = e.data;

      // const name = e.target.name;
      const foundKey = Object.keys(midiTriggers).find((key) => {
        return (
          midiTriggers &&
          midiTriggers[key].controlId == controlId &&
          midiTriggers[key].deviceId === deviceId &&
          midiTriggers[key].type === type
        );
      });

      if (foundKey) {

        setGlobalValue(foundKey, value * 2);

        const trigger = midiTriggers[foundKey];

        if (
          type == MidiEventTypes.onTurn &&
          trigger.payload.function === MidiCallback.setColour
        ) {
          // setValue(parseInt(e.target.value));
          const third = 127 / 2;
          const state = value / third;
          const frame = Math.floor(state);

          let colour = "0000ff";
          if (frame === 0) {
            colour = animateColour("ff0000", "00ff00", 1, state - frame);
          } else if (frame === 1) {
            colour = animateColour("00ff00", "0000ff", 1, state - frame);
          }
          applyAction({ ...trigger.payload, colour });
        } else if (
          type == MidiEventTypes.onTurn &&
          trigger.payload.function === MidiCallback.setState
        ) {
          applyAction({ ...trigger.payload, value: value * 2 });
        } else if (trigger.payload.function === MidiCallback.setBeatLength) {
          applyAction({ ...trigger.payload, timeStamp: e.timeStamp });
        } else {
          applyAction(trigger.payload);
        }
      }
    };

    mIDIInputs.forEach((input) => {
      if (eventHandlerRef.current) {
        input.removeEventListener(
          "midimessage",
          eventHandlerRef.current as (e: Event) => void
        );
      }

      input.addEventListener("midimessage", eventHandler as (e: Event) => void);
    });

    eventHandlerRef.current = eventHandler;
  }, [applyAction, mIDIInputs, midiTriggers, setGlobalValue]);

  return <>{children}</>;
};

export enum MidiEventTypes {
  onPress = 144,
  onRelease = 128,
  onTurn = 176,
}

export enum MidiCallback {
  setBeatLength = "setBeatLength",
  setColour = "setColour",
  setScene = "setScene",
  setState = "setState",
  removeScene = "removeScene",
}

export type MidiTrigger = {
  type: MidiEventTypes;
  name: string;
  controlId: number;
  // value: number; // this happends om the event...
  deviceId: string;
  payload: UserEventMap[keyof UserEventMap];
};

export type CustomMidiEvent = Event & {
  data: MidiTrigger;
};
