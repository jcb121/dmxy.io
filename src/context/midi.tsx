import React, { useEffect, useRef, useState } from "react";
import { useGlobals } from "./globals";

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

export const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  // const [MIDIInput, setMIDIInput] = useState<MIDIInput>();

  const midiFunctions = useGlobals((state) => state.functions);

  const midiTriggers = useGlobals((state) => state.midiTriggers);
  // const setGlobalValue = useGlobals((state) => state.setGlobalValue);
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
    console.log("mIDIInputs", mIDIInputs);
    if (!mIDIInputs) return;

    const eventHandler = (e: MIDIMessageEventWithData) => {
      const deviceId = e.currentTarget?.id as string;
      const [type, controlId] = e.data;

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
        midiFunctions[midiTriggers[foundKey].callBack](
          e,
          midiTriggers[foundKey]
        );
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
  }, [mIDIInputs, midiTriggers, midiFunctions]);

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
  turnOn = "turnOn",
  turnOff = "turnOff",
  setState = "setState",
}

// export type MidiCallback = (e: { value: number; timestamp: number }) => void;

export type MidiTrigger = {
  type: MidiEventTypes;
  name: string;
  controlId: number;
  value: number;
  deviceId: string;
  callBack: MidiCallback;
  key: string;
};

export type CustomMidiEvent = Event & {
  data: MidiTrigger;
};
