import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const Empty = ({
  buttonId,
  editMode,
}: {
  buttonId: string;
  editMode: boolean;
}) => {
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  const globals = useGlobals((state) => state.values);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  return (
    <div>
      <div className={styles.mainKnob}>
        <input
          type="range"
          value={globals[buttonId]?.value || 0}
          onChange={(e) =>
            setGlobalValue(buttonId, {
              type: GlobalTypes.byte,
              value: parseInt(e.target.value),
            })
          }
          max={255}
        />
      </div>
      {editMode && (
        <AttachMidiButton
          value={midiTriggers[buttonId]}
          onMidiDetected={(midiTrigger) => {
            setMidiTrigger(buttonId, {
              ...midiTrigger,
              payload: {
                function: MidiCallback.setState,
                globalVar: buttonId,
                payload: {
                  value: 0,
                  type: GlobalTypes.byte,
                },
              },
            });
          }}
          label={"Attach Knob"}
        />
      )}
    </div>
  );
};
