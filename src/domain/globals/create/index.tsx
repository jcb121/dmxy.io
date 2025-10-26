import { useState } from "react";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import styles from "./styles.module.scss";

export const CreateGlobal = () => {
  const [globalName, setGlobalName] = useState("");
  const [globalType, setGlobalType] = useState<GlobalTypes | "">("");
  const [globalValue, setValue] = useState("");
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

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
    <div className={styles.create}>
      <div className={styles.label}>Create Global:</div>

      <input
        className={styles.input}
        placeholder="name"
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
  );
};
