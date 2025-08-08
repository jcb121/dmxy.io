import { useState } from "react";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { setState as setStateEvent } from "../../../context/events";
import { BaseButton } from "./base-button";
import { MidiEventTypes } from "../../../context/midi";

export const SetState = ({
  active,
  editMode,
  payload,
  onEventChange,
}: {
  active?: boolean;
  editMode: boolean;
  payload?: setStateEvent;
  onEventChange: (s: setStateEvent) => void;
}) => {
  const globalState = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);
  const options = Object.keys(globalState).filter((key) => key[0] !== "_");
  const [key, setKey] = useState("");
  const foundVar = key && globalState[key] ? globalState[key] : false;

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          payload?.globalVar && setGlobalState(payload, MidiEventTypes.onPress);
        }}
      >
        {payload?.globalVar ?? "empty"}:{payload?.payload?.value ?? "empty"}
      </BaseButton>
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
        </div>
      )}
    </>
  );
};
