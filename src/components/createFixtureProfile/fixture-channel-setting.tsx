import { ChannelFunction, ChannelSimpleFunction } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";

import styles from "./fixture-channel-setting.module.scss";

export const FixtureChannelSetting = ({
  channel,
  channelValue,
  onChange,
  onLabelChange,
  labelValue,
}: {
  onChange: (n: number) => void;
  channelValue: number;
  channel: ChannelFunction;
  labelValue?: string;
  onLabelChange?: (l: string) => void;
}) => {
  const globals = useGlobals((state) => state.globals);

  return (
    <>
      {Object.keys(channel).map((functionIndex) => {
        const func = channel[parseInt(functionIndex)];

        return (
          <tr key={func.function}>
            <td>
              {func.function === ChannelSimpleFunction.colour ? (
                <input
                  className={styles.input}
                  size={9}
                  style={{
                    borderStyle: "solid",
                    borderColor:
                      func.function === ChannelSimpleFunction.colour
                        ? `#${func.value}`
                        : undefined,
                  }}
                  value={labelValue}
                  onChange={(e) => {
                    onLabelChange && onLabelChange(e.target.value);
                  }}
                  // readOnly={true}
                  type="text"
                  placeholder={func.value ? `#${func.value}` : func.function}
                />
              ) : (
                func.function
              )}
            </td>
            <td>
              <input
                type="range"
                min={func.range[0]}
                max={func.range[1]}
                step="1"
                value={channelValue}
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                  //   setDmxValues((state) => {
                  //     return {
                  //       ...state,
                  //       [i]: parseInt(e.target.value),
                  //     };
                  //   });
                }}
              />
            </td>
            <td>
              <input
                className={styles.input}
                size={3}
                type="number"
                min="0"
                max="255"
                step="1"
                value={channelValue}
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
              />
            </td>
            <td>
              Global:
              <select>
                <option></option>
                {Object.keys(globals).map((v) => (
                  <option>{v}</option>
                ))}
              </select>
            </td>
          </tr>
        );
      })}
    </>
  );
};
