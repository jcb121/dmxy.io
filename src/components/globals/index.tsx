import { GlobalTypes, useGlobals } from "../../context/globals";
import { MidiCallback } from "../../context/midi";
import { AttachMidiButton } from "../attach-midi-button";

const labelMap = {
  [GlobalTypes.byte]: "Attach Knob",
  [GlobalTypes.colour]: "",
  [GlobalTypes.time]: "",
};

export const Globals = () => {
  const globalState = useGlobals((state) => state.values);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);

  return (
    <div>
      <div>Globals</div>
      <table>
        <tbody>
          {Object.keys(globalState).map((key) => (
            <tr key={key}>
              <td>
                <label>{key}</label>
              </td>
              <td>
                <input
                  value={globalState[key].value}
                  onChange={(e) => {
                    setGlobalValue(key, parseInt(e.target.value));
                  }}
                />
              </td>

              <td>
                <AttachMidiButton
                  value={midiTriggers[key]}
                  onMidiDetected={(midiTrigger) => {
                    setMidiTrigger(key, {
                      ...midiTrigger,
                      callBack: MidiCallback.setState,
                      key,
                    });
                  }}
                  label={labelMap[globalState[key].type]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
