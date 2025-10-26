import { GlobalTypes } from "../../../context/globals";
import { useScenes } from "../../../context/scenes";
import { SetVar as setVarEvent } from "../../../context/events";
import { MidiCallback } from "../../../context/midi";
import styles from "./styles.module.scss";

export const SetVarEdit = ({
  onEventChange,
  payload,
}: {
  payload: setVarEvent;
  onEventChange: (s: setVarEvent) => void;
}) => {
  const scenes = useScenes((s) => s.scenes);

  const vars = [
    ...new Set<string>(
      scenes.reduce((vars, s) => {
        const _vars = s.vars
          ? Object.keys(s.vars).filter((key) => {
              return s.vars?.[key].type === GlobalTypes.byte;
            })
          : [];

        return [...vars, ..._vars];
      }, [] as string[])
    ),
  ];

  return (
    <div className={styles.root}>
      <label>Select Var</label>
      <select
        value={payload.varName}
        onChange={(e) => {
          onEventChange({
            value: payload.value,
            function: MidiCallback.setVar,
            varName: e.target.value,
          });
        }}
      >
        <option>none</option>
        {vars.map((varName) => (
          <option key={varName}>{varName}</option>
        ))}
      </select>
      <label>Value (if button):</label>
      <input type="number" value={payload.value} />
    </div>
  );
};
