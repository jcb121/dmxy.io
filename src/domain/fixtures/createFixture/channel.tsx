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
  index,
  channelFunction,
  onChange,
}: {
  index: number;
  channelFunction: ChannelFunction;
  onChange: (f: ChannelFunction) => void;
}) => {
  return (
    <tbody key={index}>
      {channelFunction.map((func, functionIndex) => {
        return (
          <FunctionSelect
            channel={index}
            key={functionIndex}
            functionIndex={functionIndex}
            totalFunctions={channelFunction.length}
            value={func}
            onRemove={() => {
              onChange(
                channelFunction.filter(
                  (_i, _index) => _index !== functionIndex,
                ),
              );
            }}
            onChange={(subChannelFunction) => {
              onChange(
                channelFunction.map((i, _index) =>
                  _index === functionIndex ? subChannelFunction : i,
                ),
              );
            }}
          />
        );
      })}

      <tr>
        <td colSpan={7} className={styles.addRow}>
          <Button
            className={styles.add}
            onClick={() => {
              onChange([...channelFunction, defaultValue]);
            }}
          >
            Add row
          </Button>
        </td>
      </tr>
    </tbody>
  );
};
