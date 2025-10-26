import { GlobalTypes, useGlobals } from "../../../context/globals";
import { PadDial } from "../../pad-dial";

export const Empty = ({
  buttonId,
}: {
  buttonId: string;
}) => {
  const globals = useGlobals((state) => state.values);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  return (
    <>
      <PadDial
        value={(globals[buttonId]?.value as number) || 0}
        label={"NONE"}
        onChange={(e) =>
          setGlobalValue(buttonId, {
            type: GlobalTypes.byte,
            value: parseInt(e.target.value),
          })
        }
      />
    </>
  );
};
