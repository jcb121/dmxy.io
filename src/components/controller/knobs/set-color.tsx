// import { GlobalTypes, useGlobals } from "../../../context/globals";
// import { AttachMidiButton } from "../../attach-midi-button";
// import { MidiCallback } from "../../../context/midi";

import { useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { animateColour, rgbToHex } from "../../../utils";
import styles from "../controller.module.scss";
import { AttachMidiButton } from "../../attach-midi-button";

export const SetColour = ({
  buttonId,
  editMode,
}: {
  buttonId: string;
  editMode: boolean;
}) => {
  // const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  // const midiTriggers = useGlobals((state) => state.midiTriggers);

  const globalState = useGlobals((state) => state.values);

  const colour = rgbToHex([
    globalState["Red"]?.value as number,
    globalState["Green"]?.value as number,
    globalState["Blue"]?.value as number,
  ]);

  const value = globalState[buttonId]?.value || 0;

  // const options = Object.keys(globalState).filter((key) => {
  //   if (globalState[key].type === GlobalTypes.colour) {
  //     return key;
  //   }
  // });
  // const [value, setValue] = useState(0);
  // const key = "GLOBAL_COLOURS";

  const setGlobalColour = useGlobals((state) => state.handlers.setColour);

  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  return (
    <div>
      {/* <div>Set Colour</div> */}
      {/* <select onChange={(e) => setKey(e.target.value)}>
        <option value="">None</option>
        {options.map((_key) => (
          <option key={_key}>{_key}</option>
        ))}
      </select> */}
      <div
        className={styles.mainKnob}
        style={{
          borderColor: `#${colour}`,
        }}
      >
        <div>Global Colour</div>
        <input
          type="range"
          value={value}
          max={255}
          onChange={(e) => {
            // console.log('Setting', buttonId, parseInt(e.target.value))

            const third = 255 / 2;
            const state = parseInt(e.target.value) / third;
            const frame = Math.floor(state);

            let colour = "0000ff";
            if (frame === 0) {
              colour = animateColour("ff0000", "00ff00", 1, state - frame);
            } else if (frame === 1) {
              colour = animateColour("00ff00", "0000ff", 1, state - frame);
            }

            setGlobalColour({
              function: MidiCallback.setColour,
              colour,
            });
          }}
        />
      </div>
      {editMode && (
        <AttachMidiButton
          value={midiTriggers[buttonId]}
          onMidiDetected={(midiTrigger) => {
            setMidiTrigger(buttonId, {
              ...midiTrigger,
              payload: {
                function: MidiCallback.setColour,
              },
            });
          }}
          label={"Attach Knob"}
        />
      )}
    </div>
  );
};
