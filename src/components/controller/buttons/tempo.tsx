import { SetBeatLength as SetBeatLengthEvent } from "../../../context/events";
import { GlobalTypes, useGlobals } from "../../../context/globals";
// import { AttachMidiButton } from "../../../attach-midi-button";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";

import styles from "../controller.module.scss";

const oneMinute = 60 * 1000;

export const Tempo = ({
  buttonId,
  editMode,
  // setGlobalVar,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  editMode: boolean;

  payload?: SetBeatLengthEvent;
  onEventChange: (s: SetBeatLengthEvent) => void;
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

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: SetBeatLengthEvent) => {
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
      <button onClick={handleClick} className={styles.mainButton}>
        <div>Tempo</div>
        <div>Tap {bpm}</div>
      </button>
      {editMode && (
        <div>
          Global:
          <select
            onChange={(e) => {
              if (payload)
                onEventChange({
                  ...payload,
                  globalVar: e.target.value,
                });
            }}
          >
            {options.map((_key) => (
              <option key={_key}>{_key}</option>
            ))}
          </select>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_tempo`]}
            onMidiDetected={(midiTrigger) => {
              if (payload)
                setMidiTrigger(`${buttonId}_tempo`, {
                  ...midiTrigger,
                  payload,
                });
            }}
            label={"Attach Button"}
          />
        </div>
      )}
    </div>
  );
};
