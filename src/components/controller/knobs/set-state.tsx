import { setState as setStateEvent, useEvents } from "../../../context/events";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import styles from "../controller.module.scss";

export const SetState = ({
  buttonId,
  payload,
  onEventChange,
}: {
  buttonId: string;
  payload?: setStateEvent;
  onEventChange: (s: setStateEvent) => void;
}) => {
  const editMode = useEvents((state) => state.editMode);
  const globalState = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);

  const options = Object.keys(globalState)
    .filter((key) => key[0] !== "_")
    .filter((key) => {
      if (globalState[key]?.type === GlobalTypes.byte) {
        return true;
      }
    });

  // const [key, setKey] = useState<string>();
  const foundVar =
    (payload?.globalVar && globalState[payload.globalVar]) || undefined;

  return (
    <>
      <div className={styles.mainKnob}>
        <div className={styles.content}>
          <div className={styles.label}>{payload?.globalVar}</div>

          <input
            className={styles.input}
            type="range"
            value={
              globalState[buttonId]?.value || (foundVar && foundVar.value) || 0
            }
            onChange={(e) => {
              if (!foundVar) return;
              if (
                foundVar.type === GlobalTypes.byte ||
                foundVar.type === GlobalTypes.time
              ) {
                payload &&
                  setGlobalState(
                    {
                      ...payload,
                      payload: {
                        value: parseInt(e.target.value),
                        type: foundVar.type,
                      },
                    },
                    MidiEventTypes.onTurn
                  );
              }
            }}
            max={255}
          />
        </div>
      </div>
      {editMode && (
        <div>
          <div>Select Global</div>
          <select
            onChange={(e) => {
              const key = e.target.value;
              if (key && globalState[key]) {
                onEventChange({
                  function: MidiCallback.setState,
                  globalVar: key,
                  payload: globalState[key],
                });
              }
            }}
            value={payload?.globalVar || ""}
          >
            <option value="">None</option>
            {options.map((_key) => (
              <option key={_key}>{_key}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};
