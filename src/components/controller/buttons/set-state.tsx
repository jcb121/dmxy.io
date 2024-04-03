import { useState } from "react";
import {
  GlobalTypes,
  NewGlobalsValue,
  useGlobals,
} from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetState = ({
  buttonId,
  editMode,
  payload,
  setValue,
  globalVar,
}: {
  buttonId: string;
  globalVar?: string;
  editMode: boolean;
  payload?: NewGlobalsValue[keyof NewGlobalsValue];
  setValue: (
    globalVar?: string,
    payload?: NewGlobalsValue[keyof NewGlobalsValue]
  ) => void;
}) => {
  const globalState = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const options = Object.keys(globalState).filter((key) => key[0] !== "_");
  const [key, setKey] = useState("");
  const foundVar = key && globalState[key] ? globalState[key] : false;

  return (
    <div>
      <button
        className={styles.mainButton}
        onClick={() => {
          globalVar &&
            setGlobalState({
              globalVar,
              payload,
              function: MidiCallback.setState,
            });
        }}
      >
        {globalVar ?? "empty"}:{payload?.value ?? "empty"}
      </button>
      {editMode && (
        <div>
          Select Global
          <select
            onChange={(e) => {
              setKey(e.target.value);
            }}
            value={key || ""}
          >
            <option value="">None</option>
            {options.map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
          <div>
            value:
            <input
              value={payload?.value || ""}
              onChange={(e) => {
                if (!foundVar) return;
                if (
                  foundVar.type === GlobalTypes.byte ||
                  foundVar.type === GlobalTypes.time
                ) {
                  setValue(globalVar, {
                    value: parseInt(e.target.value),
                    type: foundVar.type,
                  });
                } else if (foundVar.type === GlobalTypes.colour) {
                  setValue(globalVar, {
                    value: e.target.value,
                    type: foundVar.type,
                  });
                } else if (foundVar.type === GlobalTypes.scene) {
                  setValue(globalVar, {
                    value: [e.target.value],
                    type: foundVar.type,
                  });
                }
              }}
            />
            {foundVar && `(${foundVar?.type})`}
          </div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              if (globalVar && payload)
                setMidiTrigger(`${buttonId}_press`, {
                  ...midiTrigger,
                  payload: {
                    function: MidiCallback.setState,
                    globalVar,
                    payload,
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
