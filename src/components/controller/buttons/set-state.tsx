import { useState } from "react";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";
import { setState as setStateEvent } from "../../../context/events";

export const SetState = ({
  buttonId,
  editMode,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  editMode: boolean;
  payload?: setStateEvent;
  onEventChange: (s: setStateEvent) => void;
}) => {
  const globalState = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const options = Object.keys(globalState).filter((key) => key[0] !== "_");
  const [key, setKey] = useState("");
  const foundVar = key && globalState[key] ? globalState[key] : false;

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: setStateEvent) => {
    if (midiTrigger) {
      setMidiTrigger(`${buttonId}_press`, {
        ...midiTrigger,
        payload: a,
      });
    }
    _onEventChange(a);
  };

  return (
    <div>
      <button
        className={styles.mainButton}
        onClick={() => {
          payload?.globalVar && setGlobalState(payload);
        }}
      >
        {payload?.globalVar ?? "empty"}:{payload?.payload?.value ?? "empty"}
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
              value={payload?.payload?.value || ""}
              onChange={(e) => {
                if (!foundVar || !payload) return;
                if (
                  foundVar.type === GlobalTypes.byte ||
                  foundVar.type === GlobalTypes.time
                ) {
                  onEventChange({
                    ...payload,
                    payload: {
                      value: parseInt(e.target.value),
                      type: foundVar.type,
                    },
                  });
                } else if (foundVar.type === GlobalTypes.colour) {
                  onEventChange({
                    ...payload,
                    payload: {
                      value: e.target.value,
                      type: foundVar.type,
                    },
                  });
                } else if (foundVar.type === GlobalTypes.scene) {
                  onEventChange({
                    ...payload,
                    payload: {
                      value: [e.target.value],
                      type: foundVar.type,
                    },
                  });
                }
              }}
            />
            {foundVar && `(${foundVar?.type})`}
          </div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              if (payload)
                setMidiTrigger(`${buttonId}_press`, {
                  ...midiTrigger,
                  payload,
                });
            }}
            label="Attach Down"
          />
        </div>
      )}
    </div>
  );
};
