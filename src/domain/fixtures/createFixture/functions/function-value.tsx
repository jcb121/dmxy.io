import { IconButton } from "../../../../ui/buttonLink";

export const FunctionValue = ({
  disabled,
  channelOptions,
  channel,
  value,
  onChange,
  onDelete,
}: {
  onDelete?: () => void;
  disabled?: boolean;
  channelOptions: string[];
  channel: string;
  value: number;
  onChange: (channel: string, value: number) => void;
}) => {
  return (
    <>
      <td>
        <select
          name="functionChannel"
          data-testid="functionChannel"
          disabled={disabled}
          value={channel}
          onChange={(e) => {
            onChange(e.target.value, value);
          }}
        >
          <option value="">none</option>
          {channelOptions.map((o) => (
            <option value={o} key={o}>
              Ch {o}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          name="functionValue"
          data-testid="functionValue"
          disabled={disabled}
          type="number"
          value={value}
          min={0}
          max={255}
          onChange={(e) => {
            onChange(channel, parseInt(e.target.value));
          }}
        />
      </td>
      <td>
        <IconButton onClick={onDelete}>🗑</IconButton>
      </td>
    </>
  );
};
