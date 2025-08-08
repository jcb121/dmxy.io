import { SetBeatLength as SetBeatLengthEvent } from "../../../context/events";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { BaseButton } from "./base-button";
import styles from '../controller.module.scss';

const oneMinute = 60 * 1000;

export const Tempo = ({
  editMode,
  payload,
  onEventChange,
  active,
}: {
  editMode: boolean;
  active?: boolean;
  payload?: SetBeatLengthEvent;
  onEventChange: (s: SetBeatLengthEvent) => void;
}) => {
  const setBeatLength = useGlobals((state) => state.handlers.setBeatLength);
  const beatlength = useGlobals((state) => state.values.Beatlength?.value);
  const globalState = useGlobals((state) => state.values);

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
    }, MidiEventTypes.onPress);
  };

  return (
    <>
      <BaseButton onMouseDown={handleClick} active={active}>
        <div>Tempo</div>
        <div className={styles.noWrap}>Tap {bpm}</div>
      </BaseButton>
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
        </div>
      )}
    </>
  );
};
