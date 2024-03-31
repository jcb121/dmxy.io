import { useCallback, useState } from "react";
import { MIDIMessageEventWithData, MidiTrigger } from "../../context/midi";

export const AttachMidiButton = ({
  value,
  onMidiDetected,
  label,
}: {
  value?: MidiTrigger;
  onMidiDetected: (a: Omit<MidiTrigger, "callBack" | "key">) => void;
  label?: string;
}) => {
  const [listening, setListening] = useState<boolean>(false);

  const listenForMidiEvent = useCallback(async () => {
    setListening(true);
    const midiAccess = await navigator.requestMIDIAccess();

    const event = (e: MIDIMessageEventWithData) => {
      const deviceId = e.currentTarget.id as string;
      const [type, controlId, value] = e.data;
      const name = e.currentTarget?.name;

      onMidiDetected({
        deviceId,
        controlId,
        value,
        name,
        type,
      });

      setListening(false);
      midiAccess.inputs.forEach((i) => {
        i.removeEventListener("midimessage", event as () => void);
      });
    };

    midiAccess.inputs.forEach((i) => {
      i.addEventListener("midimessage", event as () => void);
    });
  }, [onMidiDetected]);

  return (
    <button disabled={listening} onClick={listenForMidiEvent}>
      {listening
        ? "Listening"
        : value
        ? `${value.name}-${value.controlId}`
        : label}
    </button>
  );
};
