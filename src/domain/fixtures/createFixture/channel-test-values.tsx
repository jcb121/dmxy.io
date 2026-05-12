import { useEffect, useState } from "react";
import { DMXState } from "../../../context/dmx";
import { DEFAULT_DMX_UNIVERSE } from "./index";
import styles from "./channel-test-values.module.scss";

export const ChannelTestValues = ({
  channelCount,
  onChannelChange,
  values,
  onValuesChange,
}: {
  channelCount: number;
  onChannelChange?: (channel: number) => void;
  values: Record<number, number>;
  onValuesChange: (values: Record<number, number>) => void;
}) => {
  const [dmxChannel, setDmxChannel] = useState(1);

  useEffect(() => {
    Object.keys(values).forEach((key) => {
      DMXState[DEFAULT_DMX_UNIVERSE][parseInt(key) + dmxChannel - 1] =
        values[parseInt(key)];
    });
  }, [values, dmxChannel]);

  const handleChannelChange = (channel: number) => {
    setDmxChannel(channel);
    onChannelChange?.(channel);
  };

  const handleValueChange = (index: number, value: number) => {
    onValuesChange({ ...values, [index]: value });
  };

  return (
    <div className={styles.root}>
      <label className={styles.channelLabel}>
        Fixture Channel:
        <input
          className={styles.channelInput}
          type="number"
          min={1}
          max={512}
          value={dmxChannel}
          onChange={(e) => handleChannelChange(parseInt(e.target.value))}
        />
      </label>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th colSpan={2}>Value</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: channelCount }, (_, index) => (
            <tr key={index}>
              <td>{`Ch: ${dmxChannel + index}`}</td>
              <td>
                <input
                  className={styles.valueInput}
                  type="number"
                  min={0}
                  max={255}
                  value={values[index] || 0}
                  onChange={(e) =>
                    handleValueChange(
                      index,
                      Math.min(255, Math.max(0, parseInt(e.target.value) || 0)),
                    )
                  }
                />
                {" "}
                <input
                  className={styles.rangeInput}
                  title="channel-value"
                  type="range"
                  min={0}
                  max={255}
                  value={values[index] || 0}
                  onChange={(e) =>
                    handleValueChange(index, parseInt(e.target.value))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
