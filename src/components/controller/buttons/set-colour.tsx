import { useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetColour = ({
  buttonId,
  editMode,
  setColour,
  colour,
}: {
  buttonId: string;
  editMode: boolean;
  setColour: (c: string) => void;
  colour?: string;
}) => {
  const setGlobalColour = useGlobals((state) => state.handlers.setColour);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  return (
    <div className={styles.root}>
      <button
        className={styles.mainButton}
        onClick={() => {
          if (!colour) return;
          setGlobalColour({
            function: MidiCallback.setColour,
            colour,
          });
        }}
        style={{
          border: colour?.length === 6 ? `10px solid #${colour}` : undefined,
        }}
      >
        Set Colour {colour}
      </button>
      {editMode && (
        <div>
          Pick Colour
          <input
            type="text"
            max={6}
            value={colour || ""}
            placeholder="ffffff"
            onChange={(e) => setColour(e.target.value)}
          />
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              console.log(midiTrigger);
              // if (!sceneId) return;
              setMidiTrigger(`${buttonId}_press`, {
                ...midiTrigger,
                payload: {
                  function: MidiCallback.setColour,
                  colour,
                  // sceneId,
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
