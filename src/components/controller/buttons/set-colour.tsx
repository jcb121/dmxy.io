import { SetColour as SetColourEvent } from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetColour = ({
  buttonId,
  editMode,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  editMode: boolean;
  payload?: SetColourEvent;
  onEventChange: (s: SetColourEvent) => void;
}) => {
  const setGlobalColour = useGlobals((state) => state.handlers.setColour);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: SetColourEvent) => {
    if (midiTrigger) {
      setMidiTrigger(`${buttonId}_press`, {
        ...midiTrigger,
        payload: a,
      });
    }
    _onEventChange(a);
  };

  return (
    <div className={styles.root}>
      <button
        className={styles.mainButton}
        onClick={() => {
          if (!payload) return;
          setGlobalColour(payload);
        }}
        style={{
          border:
            payload?.colour?.length === 6
              ? `10px solid #${payload.colour}`
              : undefined,
        }}
      >
        Set Colour {payload?.colour}
      </button>
      {editMode && (
        <div>
          Pick Colour
          <input
            type="text"
            max={6}
            value={payload?.colour || ""}
            placeholder="ffffff"
            onChange={(e) =>
              onEventChange({
                colour: e.target.value,
                function: MidiCallback.setColour,
              })
            }
          />
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
