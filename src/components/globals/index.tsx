import { GlobalTypes, useGlobals } from "../../context/globals";
import styles from "./styles.module.scss";
import { CreateGlobal } from "../../domain/globals/create";
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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>Globals</div>
        <CreateGlobal />
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

            {/* {globalState[key].type === GlobalTypes.scene && (
              <input
                className={styles.input}
                value={globalState[key]?.value.join(",")}
                onChange={(e) => {
                  setGlobalValue(key, {
                    value: e.target.value.split(","),
                    type: GlobalTypes.scene,
                  });
                }}
              />
            )} */}

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
