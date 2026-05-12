import { useCallback, useState } from "react";
import { MIDIMessageEventWithData, MidiTrigger } from "../../context/midi";
import { Button } from "../button";

export const AttachMidiButton = ({
  value,
  onMidiDetected,
  remove,
  label,
}: {
  value?: MidiTrigger;
  remove?: () => void;
  onMidiDetected: (a: Omit<MidiTrigger, "payload">) => void;
  label?: string;
}) => {
  const [listening, setListening] = useState<boolean>(false);

  const listenForMidiEvent = useCallback(
    async (e: React.MouseEvent) => {
      if (e.shiftKey) {
        return remove && remove();
      }

      setListening(true);
      const midiAccess = await navigator.requestMIDIAccess();

      const event = (e: MIDIMessageEventWithData) => {
        const deviceId = e.currentTarget.id as string;
        const [, controlId] = e.data;
        const name = e.currentTarget?.name;

        onMidiDetected({
          deviceId,
          controlId,
          name,
        });

        setListening(false);
        midiAccess.inputs.forEach((i) => {
          i.removeEventListener("midimessage", event as () => void);
        });
      };

      midiAccess.inputs.forEach((i) => {
        i.addEventListener("midimessage", event as () => void);
      });
    },
    [onMidiDetected, remove],
  );

  return (
    <Button disabled={listening} onClick={listenForMidiEvent}>
      {listening
        ? "Listening"
        : value
          ? `${value.name}-${value.controlId}`
          : label}
    </Button>
  );
};
