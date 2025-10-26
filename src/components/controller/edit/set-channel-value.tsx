import styles from "./styles.module.scss";
import { SetChannelValue as SetChannelValueEvent } from "../../../context/events";
import { ChannelSimpleFunction } from "../../../context/fixtures";

export const SetChannelValueEdit = ({
  onEventChange,
  payload,
}: {
  payload: SetChannelValueEvent;
  onEventChange: (s: SetChannelValueEvent) => void;
}) => {
  return (
    <div className={styles.root}>
      <label>Channel:</label>
      <select
        value={payload.channel}
        onChange={(e) => {
          onEventChange({
            ...payload,
            channel:
              ChannelSimpleFunction[
                e.target.value as keyof typeof ChannelSimpleFunction
              ],
          });
        }}
      >
        {Object.values(ChannelSimpleFunction).map((channel) => (
          <option key={channel}>{channel}</option>
        ))}
      </select>
      <label>Value (if Button):</label>
      <input
        type="number"
        value={payload.value || 0}
        min={0}
        max={255}
        onChange={(e) => {
          onEventChange({
            ...payload,
            value: parseInt(e.target.value),
          });
        }}
      />
      <label>Type:</label>
      <select
        value={payload.type}
        onChange={(e) => {
          onEventChange({
            ...payload,
            type: e.target.value as "MIN" | "MAX",
          });
        }}
      >
        <option value="MAX">Max</option>
        <option value="MIN">Min</option>
      </select>
    </div>
  );
};
