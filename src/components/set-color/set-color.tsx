import { useGlobals } from "../../context/globals";
import { AttachMidiButton } from "../attach-midi-button";
import { MidiCallback } from "../../context/midi";

export const SetColour = () => {
  const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  const midiTriggers = useGlobals((state) => state.midiTriggers);

  // const globalState = useGlobals((state) => state.values);
  // const options = Object.keys(globalState).filter((key) => {
  //   if (globalState[key].type === GlobalTypes.colour) {
  //     return key;
  //   }
  // });

  const key = "GLOBAL_COLOURS";

  return (
    <div>
      <div>Set Colour</div>
      {/* <select onChange={(e) => setKey(e.target.value)}>
        {options.map((_key) => (
          <option key={_key}>{_key}</option>
        ))}
      </select> */}
      <AttachMidiButton
        value={midiTriggers[key]}
        onMidiDetected={(midiTrigger) => {
          setMidiTrigger(key, {
            ...midiTrigger,
            callBack: MidiCallback.setColour,
            key,
          });
        }}
        label={"Attach Knob"}
      />
    </div>
  );
};
