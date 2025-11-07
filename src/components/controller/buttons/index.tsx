import { useEvents } from "../../../context/events";
import { MidiCallback } from "../../../context/midi";
import { useMidiState } from "../../../context/midi-state";
import { PadButton } from "../../pad-button";
import { CycleScene } from "./cycle-scene";
import { MergeScene } from "./merge-scene";
import { SetScene } from "./set-scene";
import { Tempo } from "./tempo";
import { useActiveVenue } from "../../../context/venues";

export const ControllerButton = ({
  id,
  onClick,
}: {
  id: string;
  onClick: (id: string) => void;
}) => {
  const venueId = useActiveVenue((state) => state.venue?.id);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc =
    venueId && buttonFuncs[venueId] ? buttonFuncs[venueId][id] : undefined;
  const buttonState = useMidiState((state) => state[id]);

  const active = buttonState > 0;

  return (
    <div
      onClick={() => {
        onClick(id);
      }}
    >
      {buttonFunc?.function === MidiCallback.setBeatLength && (
        <Tempo active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.setScene && (
        <SetScene active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.mergeScene && (
        <MergeScene active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.cycleScene && (
        <CycleScene active={active} payload={buttonFunc} />
      )}

      {!buttonFunc?.function && <PadButton label="Empty" active={active} />}
    </div>
  );
};
