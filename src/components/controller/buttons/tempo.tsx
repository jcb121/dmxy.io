import { SetBeatLength as SetBeatLengthEvent } from "../../../context/events";
import { useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { handleEvent } from "../../../domain/events";
import { PadButton } from "../../pad-button";

const oneMinute = 60 * 1000;

export const Tempo = ({
  payload,
  active,
}: {
  active?: boolean;
  payload?: SetBeatLengthEvent;
}) => {
  const beatlength = useGlobals((state) => state.values.Beatlength?.value);

  const bpm = Math.floor(
    oneMinute /
      (typeof beatlength === "number"
        ? beatlength
        : parseInt(beatlength as string))
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleEvent(
      {
        function: MidiCallback.setBeatLength,
        timeStamp: e.timeStamp,
        globalVar: undefined,
      },
      MidiEventTypes.onPress
    );
  };

  return (
    <PadButton
      label={payload?.function}
      onMouseDown={handleClick}
      active={active}
    >
      <div>Tempo</div>
      {bpm}
    </PadButton>
  );
};
