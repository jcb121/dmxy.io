import { SetVar as setVarEvent } from "../../../context/events";

import { MidiEventTypes } from "../../../context/midi";
import { handleEvent } from "../../../domain/events";
import { PadDial } from "../../pad-dial";

export const SetVar = ({ payload }: { payload: setVarEvent }) => {

  return (
    <>
      <PadDial
        value={payload.value}
        label={payload.function}
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
      <div>{payload.varName || "NONE"}</div>
    </>
  );
};
