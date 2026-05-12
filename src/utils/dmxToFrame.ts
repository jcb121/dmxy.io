import { mapNumbers } from ".";
import { ChannelFunctions, ChannelSimpleFunction } from "../context/fixtures";
import { DMXState } from "../context/dmx";

export type FrameColour = { hex: string; dmxValue: number };
export type Frame = { [key: string]: number | FrameColour[] } & { colourChannels: FrameColour[] };

export const dmxToFrame = (
  channelFunctions: ChannelFunctions,
  universe: number,
  channelNumber: number
): Frame => {
  const colourChannels: FrameColour[] = [];

  const singles = channelFunctions.reduce((res, channel, index) => {
    const dmxValue = DMXState[universe][index + channelNumber - 1];
    const func = channel.find(
      (subFunc) => dmxValue <= subFunc.range[1] && dmxValue >= subFunc.range[0]
    );
    if (!func) return res;

    if (func.function === ChannelSimpleFunction.colour && func.value) {
      const mapped = mapNumbers(func.range[0], func.range[1], dmxValue, 0, 255);
      colourChannels.push({ hex: func.value, dmxValue: mapped });
      return res;
    }

    return {
      ...res,
      [func.function]: mapNumbers(func.range[0], func.range[1], dmxValue, 0, 255),
    };
  }, {} as Record<string, number>);

  return { ...singles, colourChannels };
};
