import { PadDial } from "../../pad-dial";

export const Empty = ({
  payload,
  onChange,
}: {
  payload: {
    value: number;
  };
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <PadDial value={payload.value || 0} label={"NONE"} onChange={onChange} />
  );
};
