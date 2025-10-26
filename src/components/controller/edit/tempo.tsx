import { SetBeatLength as SetBeatLengthEvent } from "../../../context/events";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import styles from "./styles.module.scss";

export const TempoEdit = ({
  onEventChange,
  payload,
}: {
  onEventChange: (s: SetBeatLengthEvent) => void;
  payload?: SetBeatLengthEvent;
}) => {
  const globalState = useGlobals((state) => state.values);

  const options = Object.keys(globalState).filter((key) => {
    if (globalState[key]?.type === GlobalTypes.time) {
      return key;
    }
  });

  return (
    <div className={styles.root}>
      <label>Global:</label>
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
  );
};
