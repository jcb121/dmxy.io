import { FunctionSelect } from "./function-select";
import {
  ChannelFunction,
  ChannelSimpleFunction,
  SubChannelFunction,
} from "../../../context/fixtures";

import styles from "./channel.module.scss";

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
        <div>{`Channel ${index + 1}: `}</div>

        {channelFunction.map((func, functionIndex) => {
          return (
            <div
              className={styles.function}
              key={`${func.function}-${functionIndex}`}
            >
              {/* <div>Function: {index}</div> */}
              <button
                className={styles.delete}
                onClick={() => {
                  onChange(
                    channelFunction.filter(
                      (_i, _index) => _index !== functionIndex
                    )
                  );
                }}
              >
                🗑️
              </button>
              <FunctionSelect
                key={functionIndex}
                value={func}
                onChange={(subChannelFunction) => {
                  onChange(
                    channelFunction.map((i, _index) =>
                      _index === functionIndex ? subChannelFunction : i
                    )
                  );
                }}
              />
            </div>
          );
        })}

        <button
          className={styles.add}
          onClick={() => {
            onChange([...channelFunction, defaultValue]);
          }}
        >
          +
        </button>
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
