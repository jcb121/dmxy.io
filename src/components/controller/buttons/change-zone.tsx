import styles from "../controller.module.scss";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";

import { ChangeZone as ChangeZoneEvent } from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { BaseButton } from "./base-button";

export const ChangeZone = ({
  editMode,
  onEventChange,
  payload,
  active,
}: {
  active?: boolean;
  editMode: boolean;
  onEventChange: (s: ChangeZoneEvent) => void;
  payload?: ChangeZoneEvent;
}) => {
  const changeZone = useGlobals((state) => state.handlers.changeZone);

  return (
    <>
      <BaseButton
        active={active}
        onMouseUp={() => {
          if (!payload) return;
          changeZone(payload, MidiEventTypes.onRelease);
        }}
        onMouseDown={() => {
          if (!payload) return;
          changeZone(payload, MidiEventTypes.onPress);
        }}
      >
        <div className={styles.noWrap}>

        {payload?.reverse ? "Prev Zone" : "Next Zone"}
        </div>
      </BaseButton>
      {editMode && (
        <div>
          Reverse?
          <input
            type="checkbox"
            checked={payload?.reverse || false}
            onChange={(e) => {
              console.log(e.target.checked);
              onEventChange({
                function: MidiCallback.changeZone,
                reverse: e.target.checked,
              });
            }}
          />
        </div>
      )}
    </>
  );
};
