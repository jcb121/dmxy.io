import React, { useEffect, useRef, useState } from "react";
import { useGlobals, useMidiListener } from "./globals";

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

export const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  // const [MIDIInput, setMIDIInput] = useState<MIDIInput>();

  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const eventHandlerRef = useRef<(e: Event) => void>();

  const [mIDIInputs, setMIDIInputs] = useState<MIDIInputMap>();

  useEffect(() => {
    (async () => {
      const result = await navigator.permissions.query({
        name: "midi",
        sysex: true,
      });
      const midiAccess = await navigator.requestMIDIAccess();
      setMIDIInputs(midiAccess.inputs);
    })();
  }, []);

  useEffect(() => {
    if (!mIDIInputs) return;

    const eventHandler = (e: Event) => {
      const deviceId = e.currentTarget.id as string;
      const [_, controlId, value] = e.data;

      // const name = e.target.name;
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

    mIDIInputs.forEach((input) => {
      if (eventHandlerRef.current) {
        input.removeEventListener("midimessage", eventHandlerRef.current);
      }

      input.addEventListener("midimessage", eventHandler);
    });

    eventHandlerRef.current = eventHandler;
  }, [mIDIInputs, setGlobalValue, midiTriggers]);

  return <>{children}</>;
};

export enum MidiEventTypes {
  onPress = 144,
  onRelease = 128,
  onTurn = 176,
}

export type MidiTrigger = {
  // type: MidiEventTypes;
  name: string;
  controlId: string;
  value: number;
  deviceId: string;
};

export type CustomMidiEvent = Event & {
  data: MidiTrigger;
};
