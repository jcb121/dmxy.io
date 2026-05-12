import { mapNumbers } from "..";
import {
  ChannelFunctions,
  ChannelSimpleFunction,
  DMXValues,
  FixtureFunction,
} from "../../context/fixtures";
import { ProfileState } from "../../context/profiles";
import { decodeColour, getRGB, rgbToHex } from "../rgb";

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
        channelFunction.value &&
        profileSate.Colour !== undefined
      ) {
        const [r, g, b] = decodeColour(profileSate.Colour);
        if (
          channelFunction.value.toLowerCase() ===
          rgbToHex([r, g, b]).toLowerCase()
        ) {
          return channelFunction.range[0] + 1;
        }
      }

      if (
        channelFunction.function === ChannelSimpleFunction.colour &&
        channelFunction.value &&
        profileSate.Colour !== undefined
      ) {
        const [r, g, b] = decodeColour(profileSate.Colour);
        const [cr, cg, cb] = getRGB(channelFunction.value);

        let component: number;
        if (cr === 255 && cg === 255 && cb === 255) {
          component = Math.min(r, g, b); // white channel: use neutral component
        } else {
          const total = cr + cg + cb;
          component = total > 0 ? (cr * r + cg * g + cb * b) / total : 0;
        }
        component = Math.round(Math.min(255, component));

        const finalVal =
          channelFunction.mapIntensity && profileSate.Intensity !== undefined
            ? mapNumbers(0, 255, component, 0, profileSate.Intensity)
            : component;

        return mapNumbers(
          0,
          255,
          finalVal,
          channelFunction.range[0],
          channelFunction.range[1]
        );
      }

      const targetState = profileSate[channelFunction.function];
      if (typeof targetState === "undefined") {
        return channelValue;
      }

      if (
        [
          ChannelSimpleFunction.speed,
          ChannelSimpleFunction.uv,
          ChannelSimpleFunction.strobe,
          ChannelSimpleFunction.intensity,
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
