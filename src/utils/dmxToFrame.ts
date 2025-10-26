import { mapNumbers } from ".";
import { ChannelFunctions, DMXValues } from "../context/fixtures";

export const dmxToFrame = (
  channelFunctions: ChannelFunctions,
  dmxValues: DMXValues,
  channelNumber: number
): Record<string, number> => {
  const res = channelFunctions.reduce((colours, channel, index) => {
    const dmxValue = dmxValues[index + channelNumber];
    const func = channel.find(
      (subFunc) => dmxValue <= subFunc.range[1] && dmxValue >= subFunc.range[0]
    );
    if (func) {
      const val = mapNumbers(func.range[0], func.range[1], dmxValue, 0, 255);
      return {
        [func.function]: val,
        ...colours,
      };
    }

    return colours;
  }, {});
  return res;
};


