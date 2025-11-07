import { FunctionSelect } from "./function-select";
import {
  ChannelFunction,
  ChannelSimpleFunction,
  SubChannelFunction,
} from "../../../context/fixtures";

import styles from "./channel.module.scss";
import { Button } from "../../../ui/buttonLink";

export const defaultValue: SubChannelFunction = {
  range: [0, 255],
  function: ChannelSimpleFunction.unknown,
};

export const Channel = ({
  dmxValues,
  setDmxValues,
  index,
  channelFunction,
  onChange,
}: {
  index: number;
  dmxValues: Record<number, number>;
  setDmxValues: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  channelFunction: ChannelFunction;
  onChange: (f: ChannelFunction) => void;
}) => {
  return (
    <tr key={index}>
      <td>
        <table>
          <thead>
            <tr>
              <th>{`Ch ${index + 1}`}</th>
              <th>Function</th>
              <th>from</th>
              <th>to</th>
              <th>Map Intensity</th>
              <th>
                {" "}
                <Button
                  className={styles.add}
                  onClick={() => {
                    onChange([...channelFunction, defaultValue]);
                  }}
                >
                  Add row
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {channelFunction.map((func, functionIndex) => {
              return (
                <FunctionSelect
                  key={functionIndex}
                  value={func}
                  onRemove={() => {
                    onChange(
                      channelFunction.filter(
                        (_i, _index) => _index !== functionIndex
                      )
                    );
                  }}
                  onChange={(subChannelFunction) => {
                    onChange(
                      channelFunction.map((i, _index) =>
                        _index === functionIndex ? subChannelFunction : i
                      )
                    );
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </td>

      <td>
        <input
          type="range"
          min={0}
          max={255}
          value={dmxValues[index] || 0}
          onChange={(e) => {
            setDmxValues((state) => ({
              ...state,
              [index]: parseInt(e.target.value),
            }));
          }}
        />
        {dmxValues[index] || 0}
      </td>
    </tr>
  );
};
