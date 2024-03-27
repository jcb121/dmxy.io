import { useState } from "react";
import { useGlobals } from "../../context/globals";

export const Globals = () => {
  const globals = useGlobals((state) => state.globals);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const midiTriggers = useGlobals((state) => state.midiTriggers);
  const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  const [listening, setListening] = useState<Record<string, boolean>>({});

  return (
    <div>
      <div>Globals</div>
      <table>
        <tbody>
          {Object.keys(globals).map((key) => (
            <tr key={key}>
              <td>
                <label>{key}</label>
              </td>
              <td>
                <input
                  value={globals[key]}
                  onChange={(e) => {
                    setGlobalValue(key, parseInt(e.target.value));
                  }}
                />
              </td>

              <td>
                <button
                  disabled={listening[key]}
                  onClick={async () => {
                    setListening(() => ({
                      [key]: true,
                    }));
                    const midiAccess = await navigator.requestMIDIAccess();

                    const event = (e) => {
                      const deviceId = e.currentTarget.id as string;
                      const [_, controlId, value] = e.data;
                      const name = e.target.name;

                      setMidiTrigger(key, {
                        deviceId,
                        controlId,
                        value,
                        name,
                      });

                      setListening({});

                      midiAccess.inputs.forEach((i) => {
                        i.removeEventListener("midimessage", event);
                      });
                    };

                    midiAccess.inputs.forEach((i) => {
                      i.addEventListener("midimessage", event);
                    });
                  }}
                >
                  {listening[key]
                    ? "Listening"
                    : midiTriggers[key]
                    ? `${midiTriggers[key].name}-${midiTriggers[key].controlId}`
                    : "Attach Knob"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
