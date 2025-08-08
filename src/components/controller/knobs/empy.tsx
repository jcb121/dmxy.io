import { GlobalTypes, useGlobals } from "../../../context/globals";
import styles from "../controller.module.scss";

export const Empty = ({
  buttonId,
}: {
  buttonId: string;
  editMode: boolean;
}) => {
  const globals = useGlobals((state) => state.values);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  return (
    <div>
      <div className={styles.mainKnob}>
        <input
          type="range"
          value={globals[buttonId]?.value || 0}
          onChange={(e) =>
            setGlobalValue(buttonId, {
              type: GlobalTypes.byte,
              value: parseInt(e.target.value),
            })
          }
          max={255}
        />
      </div>
    </div>
  );
};
