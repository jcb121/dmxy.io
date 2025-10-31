import { mapNumbers } from ".";
import { ChannelFunctions } from "../context/fixtures";
import { DMXState } from "../context/dmx";

export const dmxToFrame = (
  channelFunctions: ChannelFunctions,
  universe: number,
  channelNumber: number
): Record<string, number> => {
  const res = channelFunctions.reduce((colours, channel, index) => {
    const dmxValue = DMXState[universe][index + channelNumber - 1];
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


