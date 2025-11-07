import { useEvents } from "../../../context/events";
import { MidiCallback } from "../../../context/midi";
import { useMidiState } from "../../../context/midi-state";
import { useActiveVenue } from "../../../context/venues";
import { Empty } from "./empty";
import { SetChannelValue } from "./set-channel-value.";
import { SetVar } from "./set-var";

export const ControllerDial = ({
  id,
  onClick,
}: {
  id: string;
  onClick: (id: string) => void;
}) => {
  const venueId = useActiveVenue(state => state.venue?.id);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = venueId && buttonFuncs[venueId] ? buttonFuncs[venueId][id] : undefined;
  const dialValue = (useMidiState((state) => state[id]) || 0) * 2;

  return (
    <div
      onClick={() => {
        onClick(id);
      }}
    >
      {buttonFunc?.function == MidiCallback.setVar && (
        <SetVar payload={{ ...buttonFunc, value: dialValue }} />
      )}

      {buttonFunc?.function == MidiCallback.setChannelValue && (
        <SetChannelValue payload={{ ...buttonFunc, value: dialValue }} />
      )}

      {!buttonFunc?.function && (
        <Empty
          payload={{
            value: dialValue,
          }}
          onChange={(e) => {
            useMidiState.setState((state) => ({
              ...state,
              [id]: parseInt(e.target.value) / 2,
            }));
          }}
        />
      )}
    </div>
  );
};
