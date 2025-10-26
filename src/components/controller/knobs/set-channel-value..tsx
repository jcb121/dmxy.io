import { SetChannelValue as SetChannelEvent } from "../../../context/events";

import { MidiEventTypes } from "../../../context/midi";
import { handleEvent } from "../../../domain/events";
import { PadDial } from "../../pad-dial";

const valMap = {
  MIN: "Min",
  MAX: "Max",
};

export const SetChannelValue = ({ payload }: { payload: SetChannelEvent }) => {
  return (
    <>
      <PadDial
        value={payload?.value || 0}
        label={payload?.function || "NONE"}
        onChange={(e) => {
          handleEvent(
            {
              ...payload,
              value: parseInt(e.target.value),
            },
            MidiEventTypes.onTurn
          );
        }}
      />
      <div>{`${valMap[payload.type]} ${payload.channel}` || "NONE"}</div>
    </>
  );
};
