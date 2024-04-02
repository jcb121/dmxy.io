import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetState = ({
  buttonId,
  editMode,
  value,
  setValue,
  globalVar,
}: {
  buttonId: string;
  globalVar?: string;
  editMode: boolean;
  value?: string | number;
  setValue: (
    value?: string | number,
    globalVar?: string,
    dataType?: GlobalTypes
  ) => void;
}) => {
  const globals = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const foundVar = globalVar && globals[globalVar];

  return (
    <div className={styles.root}>
      <button
        className={styles.mainButton}
        onClick={() => {
          globalVar &&
            value &&
            foundVar &&
            setGlobalState({
              globalVar,
              value,
              dataType: foundVar.type,
              function: MidiCallback.setState,
            });
        }}
      >
        {globalVar ?? "empty"}:{value ?? "empty"}
      </button>
      {editMode && (
        <div>
          Select Global
          <select
            onChange={(e) => setValue(value, e.target.value)}
            value={globalVar || ""}
          >
            <option value="">None</option>
            {Object.keys(globals).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
          <div>
            value:
            <input
              value={value || ""}
              onChange={(e) => {
                if (foundVar)
                  setValue(e.target.value, globalVar, foundVar.type);
              }}
            />
          </div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              if (foundVar && globalVar && value)
                setMidiTrigger(`${buttonId}_press`, {
                  ...midiTrigger,
                  payload: {
                    function: MidiCallback.setState,
                    value,
                    globalVar,
                    dataType: foundVar.type,
                  },
                });
            }}
            label="Attach Down"
          />
        </div>
      )}
    </div>
  );
};
