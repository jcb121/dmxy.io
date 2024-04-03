import { setState as setStateEvent, useEvents } from "../../../context/events";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";
import styles from "../controller.module.scss";

export const SetState = ({
  buttonId,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  payload?: setStateEvent;
  onEventChange: (s: setStateEvent) => void;
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
  const foundVar =
    (payload?.globalVar && globalState[payload.globalVar]) || undefined;

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: setStateEvent) => {
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
      <div className={styles.mainKnob}>
        <div>{payload?.globalVar}</div>

        <input
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
                setGlobalState({
                  ...payload,
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

          <AttachMidiButton
            value={midiTriggers[buttonId]}
            onMidiDetected={(midiTrigger) => {
              if (!payload) return;
              setMidiTrigger(buttonId, {
                ...midiTrigger,
                payload,
              });
            }}
            label={"Attach Knob"}
          />
        </div>
      )}
    </div>
  );
};
