import styles from "./styles.module.scss";

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
    <tr className={styles.functionValue}>
      <td>
        <select
          disabled={disabled}
          value={channel}
          onChange={(e) => {
            onChange(e.target.value, value);
          }}
        >
          <option value="">none</option>
          {channelOptions.map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          disabled={disabled}
          type="number"
          value={value}
          onChange={(e) => {
            onChange(channel, parseInt(e.target.value));
          }}
        />{" "}
        <span onClick={onDelete}>🗑</span>
      </td>
    </tr>
  );
};
