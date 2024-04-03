import { useEvents } from "../../../context/events";
import {
  GlobalTypes,
  NewGlobalsValue,
  useGlobals,
} from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetState = ({
  setValue,
  globalVar,
  buttonId,
}: {
  buttonId: string;
  globalVar?: string;
  setValue: (
    globalVar?: string,
    payload?: NewGlobalsValue[keyof NewGlobalsValue]
  ) => void;
}) => {
  const editMode = useEvents((state) => state.editMode);
  const globalState = useGlobals((state) => state.values);
  const setGlobalState = useGlobals((state) => state.handlers.setState);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);

  const options = Object.keys(globalState)
    .filter((key) => key[0] !== "_")
    .filter((key) => {
      if (globalState[key]?.type === GlobalTypes.byte) {
        return true;
      }
    });

  // const [key, setKey] = useState<string>();
  const foundVar = !!globalVar && globalState[globalVar];

  return (
    <div>
      <div className={styles.mainKnob}>
        <div>{globalVar}</div>

        <input
          type="range"
          value={
            globalState[buttonId]?.value || (foundVar && foundVar.type) || 0
          }
          onChange={(e) => {
            if (!foundVar) return;
            if (
              foundVar.type === GlobalTypes.byte ||
              foundVar.type === GlobalTypes.time
            ) {
              globalVar &&
                setGlobalState({
                  globalVar,
                  function: MidiCallback.setState,
                  payload: {
                    value: parseInt(e.target.value),
                    type: foundVar.type,
                  },
                });
            }
          }}
          max={255}
        />
      </div>
      {editMode && (
        <div>
          <div>Select Global</div>
          <select
            onChange={(e) => {
              const key = e.target.value;
              if (key && globalState[key]) {
                setValue(key, globalState[key]);
              }
            }}
            value={globalVar}
          >
            <option value="">None</option>
            {options.map((_key) => (
              <option key={_key}>{_key}</option>
            ))}
          </select>

          <AttachMidiButton
            value={midiTriggers[buttonId]}
            onMidiDetected={(midiTrigger) => {
              if (!foundVar) return;
              if (
                foundVar.type === GlobalTypes.byte ||
                foundVar.type === GlobalTypes.time
              ) {
                setMidiTrigger(buttonId, {
                  ...midiTrigger,
                  payload: {
                    function: MidiCallback.setState,
                    globalVar,
                    payload: {
                      value: 0,
                      type: foundVar.type,
                    },
                  },
                });
              }
            }}
            label={"Attach Knob"}
          />
        </div>
      )}
    </div>
  );
};
