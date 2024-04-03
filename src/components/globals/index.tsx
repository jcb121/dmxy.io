import { useState } from "react";
import { GlobalTypes, useGlobals } from "../../context/globals";
import styles from "./styles.module.scss";
// import { MidiCallback, useMidiTriggers } from "../../context/midi";
// import { AttachMidiButton } from "../attach-midi-button";

// const labelMap = {
//   [GlobalTypes.byte]: "Attach Knob",
//   [GlobalTypes.colour]: "",
//   [GlobalTypes.time]: "",
//   [GlobalTypes.scene]: "",
// };

export const Globals = () => {
  const globalState = useGlobals((state) => state.values);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  // const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  // const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  // filter out the private state
  const options = Object.keys(globalState).filter((a) => a[0] !== "_");

  const [globalName, setGlobalName] = useState("");
  const [globalType, setGlobalType] = useState<GlobalTypes | "">("");
  const [globalValue, setValue] = useState("");

  const handleSave = () => {
    if (globalType === GlobalTypes.byte) {
      setGlobalValue(globalName, {
        type: globalType,
        value: parseInt(globalValue),
      });
    } else if (globalType === GlobalTypes.colour) {
      setGlobalValue(globalName, { type: globalType, value: globalValue });
    } else if (globalType === GlobalTypes.scene) {
      setGlobalValue(globalName, {
        type: globalType,
        value: globalValue.split(","),
      });
    } else if (globalType === GlobalTypes.time) {
      setGlobalValue(globalName, {
        type: globalType,
        value: parseInt(globalValue),
      });
    }

    setGlobalName("");
    setGlobalType("");
    setValue("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>Globals</div>
        <div className={styles.create}>
          <div className={styles.label}>Create Global:</div>
          <input
            className={styles.input}
            placeholder="Var Name"
            value={globalName}
            onChange={(e) => setGlobalName(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Value"
            value={globalValue}
            onChange={(e) => setValue(e.target.value)}
          />
          <select
            className={styles.select}
            value={globalType}
            onChange={(e) => setGlobalType(e.target.value as GlobalTypes)}
          >
            <option></option>

            {Object.values(GlobalTypes).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <button
            className={styles.button}
            onClick={handleSave}
            // disabled={!globalName || !globalType}
          >
            Save
          </button>
        </div>
      </div>
      <div className={styles.items}>
        {options.map((key) => (
          <div key={key} className={styles.item}>
            <label className={styles.label}>{key}</label>

            {globalState[key].type === GlobalTypes.byte && (
              <input
                className={styles.input}
                value={globalState[key]?.value}
                onChange={(e) => {
                  setGlobalValue(key, {
                    value: parseInt(e.target.value),
                    type: GlobalTypes.byte,
                  });
                }}
              />
            )}

            {globalState[key].type === GlobalTypes.colour && (
              <input
                className={styles.input}
                value={globalState[key]?.value}
                onChange={(e) => {
                  setGlobalValue(key, {
                    value: e.target.value,
                    type: GlobalTypes.colour,
                  });
                }}
              />
            )}

            {globalState[key].type === GlobalTypes.scene && (
              <input
                className={styles.input}
                // @ts-expect-error react isn't checking this properyl
                value={globalState[key]?.value.join(",")}
                onChange={(e) => {
                  setGlobalValue(key, {
                    value: e.target.value.split(","),
                    type: GlobalTypes.scene,
                  });
                }}
              />
            )}

            {globalState[key].type === GlobalTypes.time && (
              <input
                className={styles.input}
                value={globalState[key]?.value}
                onChange={(e) => {
                  setGlobalValue(key, {
                    value: parseInt(e.target.value),
                    type: GlobalTypes.time,
                  });
                }}
              />
            )}

            {/* <AttachMidiButton
                  value={midiTriggers[key]}
                  onMidiDetected={(midiTrigger) => {
                    setMidiTrigger(key, {
                      ...midiTrigger,
                      callBack: MidiCallback.setState,
                      key,
                    });
                  }}
                  label={labelMap[globalState[key].type]}
                /> */}
          </div>
        ))}
      </div>
    </div>
  );
};
