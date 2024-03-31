import { useState } from "react";
import { GlobalTypes, useGlobals } from "../../context/globals";
import { AttachMidiButton } from "../attach-midi-button";
import { MIDIMessageEventWithData, MidiCallback } from "../../context/midi";

const oneMinute = 60 * 1000;

export const Tempo = () => {
  const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  const setBeatLength = useGlobals((state) => state.functions.setBeatLength);
  const beatlength = useGlobals((state) => state.values.Beatlength.value);
  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const globalState = useGlobals((state) => state.values);

  const options = Object.keys(globalState).filter((key) => {
    if (globalState[key].type === GlobalTypes.time) {
      return key;
    }
  });
  const [key, setKey] = useState<string>(options[0]);

  const bpm = Math.floor(
    oneMinute /
      (typeof beatlength === "number" ? beatlength : parseInt(beatlength))
  );

  const handleClick = (e: Event) => {
    // @ts-expect-error Weird type
    e.data = [0, 0, 0];
    // @ts-expect-error Weird type
    setBeatLength(e as MIDIMessageEventWithData);
  };

  return (
    <div>
      <div>Set tempo</div>
      <select onChange={(e) => setKey(e.target.value)}>
        {options.map((_key) => (
          <option key={_key}>{_key}</option>
        ))}
      </select>
      <button onClick={(e) => handleClick(e as unknown as Event)}>
        Tap {bpm}
      </button>
      <AttachMidiButton
        value={midiTriggers[key]}
        onMidiDetected={(midiTrigger) => {
          setMidiTrigger(key, {
            ...midiTrigger,
            callBack: MidiCallback.setBeatLength,
            key,
          });
        }}
        label={"Attach Button"}
      />
    </div>
  );
};
