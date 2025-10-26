import React, { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SetVar, useEvents } from "./events";
import { handleEvent } from "../domain/events";

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

const press: Record<string, number> = {};

export const getMidiEventType = (
  e: MIDIMessageEventWithData
): MidiEventTypes => {
  const [event, controlId] = e.data;
  const eventByte = event.toString(16).padStart(2, "0");

  if (eventByte[0] === "9") {
    press[`${e.currentTarget.id}-${controlId}`] = e.timeStamp;
    return MidiEventTypes.onPress;
  }
  if (eventByte[0] === "8") {
    if (e.timeStamp - press[`${e.currentTarget.id}-${controlId}`] > 1000) {
      press[`${e.currentTarget.id}-${controlId}`] = 0;
      return MidiEventTypes.onHoldRelease;
    }

    return MidiEventTypes.onRelease;
  }
  if (eventByte[0] === "a") return MidiEventTypes.onAfterTouch;
  if (eventByte[0] === "b") return MidiEventTypes.onTurn;

  return MidiEventTypes.unknown;
};

export const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  const eventHandlerRef = useRef<(e: MIDIMessageEventWithData) => void>();
  const [mIDIInputs, setMIDIInputs] = useState<MIDIInputMap>();

  useEffect(() => {
    (async () => {
      const result = await navigator.permissions.query({
        name: "midi",
        // @ts-expect-error Missing type
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
      const { midiTriggers } = useMidiTriggers.getState();
      const { buttonFuncs } = useEvents.getState();

      const [, controlId, value] = e.data;
      const type = getMidiEventType(e);

      const id = Object.keys(midiTriggers).find((key) => {
        return (
          midiTriggers &&
          midiTriggers[key].controlId == controlId &&
          midiTriggers[key].deviceId === deviceId
        );
      });

      if (id) {
        const payload = buttonFuncs[id];
        if (!payload) return;

        if (payload.function === MidiCallback.setBeatLength) {
          handleEvent({ ...payload, timeStamp: e.timeStamp }, type);
        } else if (type === MidiEventTypes.onTurn) {
          handleEvent(
            { ...payload, value: value * 2, functionId: id } as SetVar,
            type
          );
        } else if (
          type === MidiEventTypes.onPress ||
          type === MidiEventTypes.onHoldRelease ||
          type === MidiEventTypes.onRelease
        ) {
          handleEvent(payload, type);
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

      console.log("ATTACHING");
      input.addEventListener("midimessage", eventHandler as (e: Event) => void);
    });

    eventHandlerRef.current = eventHandler;
  }, [mIDIInputs]);

  return <>{children}</>;
};

export enum MidiEventTypes {
  onTurn = "onTurn",
  onPress = "onPress",
  onRelease = "onRelease",
  unknown = "unknown",
  onAfterTouch = "onAfterTouch",
  onHoldRelease = "onHoldRelease",
}

export enum MidiCallback {
  cycleScene = "cycleScene",
  setScene = "setScene",
  setBeatLength = "setBeatLength",
  mergeScene = "mergeScene",
  setVar = "setVar",
  setChannelValue = "setChannelValue",

  // setColour = "setColour",
  // playColour = "playColour",
  // setState = "setState",
  // removeScene = "removeScene",
  // toggleColour = "toggleColour",
  // changeZone = "changeZone",
  // setRenderMode = "setRenderMode",
}

export type MidiTrigger = {
  name: string;
  controlId: number;
  // value: number; // this happends om the event...
  deviceId: string;
};

export type CustomMidiEvent = Event & {
  data: MidiTrigger;
};
