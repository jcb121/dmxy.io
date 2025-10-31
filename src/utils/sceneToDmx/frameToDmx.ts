import { mapNumbers } from "..";
import {
  ChannelFunctions,
  ChannelSimpleFunction,
  DMXValues,
  FixtureFunction,
} from "../../context/fixtures";
import { ProfileState } from "../../context/profiles";
import { rgbToHex } from "../rgb";

export const frameToDmx = (
  channelFunctions: ChannelFunctions,
  profileSate: Partial<ProfileState>,
  targetFunction: string | undefined,
  deviceFunction: FixtureFunction[] | undefined
) => {
  const applyFunction = deviceFunction?.find(
    (df) => df.label === targetFunction
  )?.values;

  const res = channelFunctions.reduce((dmxValues, channel, channelId) => {
    const channelValue = channel.reduce((channelValue, channelFunction) => {
      const functionValue = applyFunction?.[channelFunction.function];
      if (typeof functionValue !== "undefined") {
        return functionValue;
      }

      if (
        channelFunction.function === ChannelSimpleFunction.fixedColour &&
        profileSate.Red &&
        profileSate.Green &&
        profileSate.Blue
      ) {
        if (
          channelFunction.value ===
          rgbToHex([profileSate.Red, profileSate.Green, profileSate.Blue])
        ) {
          return channelFunction.range[0] + 1;
        }
      }
      // everything else acts the same...
      const targetState = profileSate[channelFunction.function];
      if (typeof targetState === "undefined") {
        return channelValue; // return last set value so 0
      }

      if (
        [
          ChannelSimpleFunction.speed,
          ChannelSimpleFunction.red,
          ChannelSimpleFunction.white,
          ChannelSimpleFunction.uv,
          ChannelSimpleFunction.green,
          ChannelSimpleFunction.blue,
          ChannelSimpleFunction.strobe,
          ChannelSimpleFunction.amber,
          ChannelSimpleFunction.intensity,
          ChannelSimpleFunction.colour,
        ].includes(channelFunction.function)
      ) {
        const finalVal =
          channelFunction.mapIntensity && profileSate.Intensity !== undefined
            ? mapNumbers(0, 255, targetState, 0, profileSate.Intensity)
            : targetState;

        return mapNumbers(
          0,
          255,
          finalVal,
          channelFunction.range[0],
          channelFunction.range[1]
        );
      }
      return channelValue;
    }, 0);

    return {
      ...dmxValues,
      [channelId]: channelValue,
    };
  }, {} as DMXValues);

  return res;
};
