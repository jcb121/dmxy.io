import { GlobalTypes, useGlobals } from "../../../context/globals";
// import { AttachMidiButton } from "../../../attach-midi-button";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";

import styles from "../controller.module.scss";

const oneMinute = 60 * 1000;

export const Tempo = ({
  buttonId,
  editMode,
  setGlobalVar,
}: {
  buttonId: string;

  globalVar?: string;
  setGlobalVar: (a: string) => void;
  editMode: boolean;
}) => {
  const setBeatLength = useGlobals((state) => state.handlers.setBeatLength);
  const beatlength = useGlobals((state) => state.values.Beatlength?.value);
  const globalState = useGlobals((state) => state.values);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  const options = Object.keys(globalState).filter((key) => {
    if (globalState[key]?.type === GlobalTypes.time) {
      return key;
    }
  });

  const bpm = Math.floor(
    oneMinute /
      (typeof beatlength === "number"
        ? beatlength
        : parseInt(beatlength as string))
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setBeatLength({
      function: MidiCallback.setBeatLength,
      timeStamp: e.timeStamp,
      globalVar: undefined,
    });
  };

  return (
    <div>
      <button onClick={handleClick} className={styles.mainButton}>
        <div>Tempo</div>
        <div>Tap {bpm}</div>
      </button>
      {editMode && (
        <div>
          <select onChange={(e) => setGlobalVar(e.target.value)}>
            {options.map((_key) => (
              <option key={_key}>{_key}</option>
            ))}
          </select>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_tempo`]}
            onMidiDetected={(midiTrigger) => {
              setMidiTrigger(`${buttonId}_tempo`, {
                ...midiTrigger,
                payload: {
                  function: MidiCallback.setBeatLength,
                  timeStamp: undefined,
                  globalVar: undefined,
                },
              });
            }}
            label={"Attach Button"}
          />
        </div>
      )}
    </div>
  );
};
