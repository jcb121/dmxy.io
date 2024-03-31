import { useState } from "react";
import { useGlobals } from "../../context/globals";
import { AttachMidiButton } from "../attach-midi-button";
import { MidiCallback, MidiEventTypes } from "../../context/midi";

export const SetScene = () => {
  const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  const [key, setKey] = useState<string>();

  return (
    <div>
      Set actions Scene:{" "}
      <select
        value={key}
        onChange={(e) => {
          console.log(e.target.value);
          setKey(e.target.value);
        }}
      >
        <option></option>
        <option>Black Out</option>
        <option>White</option>
      </select>
      <button>press</button>
      <AttachMidiButton
        onMidiDetected={(midiTrigger) => {
          if (!key) return;
          setMidiTrigger(`${key}_down`, {
            ...midiTrigger,
            callBack: MidiCallback.turnOn,
            key,
          });
          setMidiTrigger(`${key}_up`, {
            ...midiTrigger,
            type: MidiEventTypes.onRelease,
            callBack: MidiCallback.turnOff,
            key,
          });
        }}
        label="Attach Button"
      />
    </div>
  );
};
