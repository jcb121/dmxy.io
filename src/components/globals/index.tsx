import { useGlobals } from "../../context/globals";
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
    <div>
      <div>Globals</div>
      <table>
        <tbody>
          {options.map((key) => (
            <tr key={key}>
              <td>
                <label>{key}</label>
              </td>
              <td>
                <input
                  value={globalState[key]?.value || ""}
                  onChange={(e) => {
                    setGlobalValue(key, parseInt(e.target.value));
                  }}
                />
              </td>

              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
