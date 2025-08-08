import { MidiCallback, MidiEventTypes } from "../../../context/midi";

import {
  RenderModes,
  SetRenderMode as setRenderModeEvent,
} from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { BaseButton } from "./base-button";

export const SetRenderMode = ({
  active,
  editMode,
  onEventChange,
  payload,
}: {
  active?: boolean;
  editMode: boolean;
  onEventChange: (s: setRenderModeEvent) => void;
  payload?: setRenderModeEvent;
}) => {
  const setRenderMode = useGlobals((state) => state.handlers.setRenderMode);

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          if (!payload) return;
          setRenderMode(payload, MidiEventTypes.onPress);
        }}
      >
        Render mode: {payload?.renderMode}
      </BaseButton>
      {editMode && (
        <div>
          Pick RenderMode
          <select
            value={payload?.renderMode}
            onChange={(e) => {
              onEventChange({
                renderMode: e.target.value as RenderModes,
                function: MidiCallback.setRenderMode,
              });
            }}
          >
            <option></option>
            {Object.keys(RenderModes).map((mode) => (
              <option value={mode} key={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};
