import { DMXState } from "../context/dmx";
import {
  ChannelFunctions,
  ChannelSimpleFunction,
  SubChannelFunction,
  Fixture,
} from "../context/fixtures";
import { DEFAULT_DMX_UNIVERSE } from "../domain/fixtures/createFixture";
import { dmxToFrame } from "./dmxToFrame";
import { getRGB } from "./rgb";

export const mapNumbers = (
  A: number,
  B: number,
  X: number,
  C: number,
  D: number
) => ((X - A) / (B - A)) * (D - C) + C;

export const getUVBrightness = (channelValue?: number) => {
  return typeof channelValue === "number"
    ? mapNumbers(0, 255, channelValue, 0, 1)
    : 0;
};

export const getCSSBrightness = (channelValue?: number) => {
  return typeof channelValue === "number"
    ? mapNumbers(0, 255, channelValue, 0, 1)
    : 1;
};

export const getCSSStrobeDuration = (channelValue?: number) => {
  return channelValue
    ? mapNumbers(
        0,
        255,
        channelValue,
        1000, // 1s
        100 // 100ms
      )
    : 0;
};

export const findFunction = (
  channelFunctions: ChannelFunctions,
  _channelFunction: ChannelSimpleFunction
): SubChannelFunction<ChannelSimpleFunction, number, number> | undefined => {
  for (let index = 0; index < channelFunctions.length; index++) {
    const channelFunction = channelFunctions[index];

    const found = channelFunction.find((f) => f.function === _channelFunction);
    if (found) return found;
  }
};

const hasColourHex = (channelFunctions: ChannelFunctions, hex: string) =>
  channelFunctions.some((ch) =>
    ch.some((f) => f.function === ChannelSimpleFunction.colour && f.value === hex)
  );

export const setCSSVarsFromDmx = (
  htmlElement: HTMLDivElement,
  { channelFunctions, deviceFunctions }: Fixture,
  universe: number | undefined = DEFAULT_DMX_UNIVERSE,
  channelNumber: number
) => {
  const channels = dmxToFrame(channelFunctions, universe, channelNumber);
  const colourChannels = channels.colourChannels;
  const Strobe = channels[ChannelSimpleFunction.strobe] as number | undefined;
  const Intensity = channels[ChannelSimpleFunction.intensity] as number | undefined;
  const UV = channels[ChannelSimpleFunction.uv] as number | undefined;

  const cssStobeTime = getCSSStrobeDuration(Strobe);
  const cssBrightness = getCSSBrightness(Intensity);
  const cssUV = getUVBrightness(UV);

  const isRGBFixture =
    hasColourHex(channelFunctions, "ff0000") &&
    hasColourHex(channelFunctions, "00ff00") &&
    hasColourHex(channelFunctions, "0000ff");
  const hasWhiteChannel = hasColourHex(channelFunctions, "ffffff");

  const activeFunction = deviceFunctions?.find((df) => {
    const entries = Object.entries(df.values).filter(([key]) => key !== "");
    if (entries.length === 0) return false;
    return entries.every(([key, expectedValue]) => {
      const offset = parseInt(key) - 1;
      return DMXState[universe][offset + channelNumber - 1] === expectedValue;
    });
  });

  htmlElement.style.setProperty("--Label", `"${activeFunction?.label || ""}"`);
  htmlElement.style.setProperty("--Brightness", `${cssBrightness}`);
  htmlElement.style.setProperty("--StrobeTime", `${cssStobeTime}ms`);

  // fixed colour channels take priority
  for (
    let channelIndex = 0;
    channelIndex < channelFunctions.length;
    channelIndex++
  ) {
    const channel = channelFunctions[channelIndex];
    const channelFunction = channel.find(
      (func) =>
        func.function === ChannelSimpleFunction.fixedColour &&
        func.value &&
        func.range[0] <= DMXState[universe][channelIndex + channelNumber - 1] &&
        DMXState[universe][channelIndex + channelNumber - 1] <= func.range[1]
    );
    if (channelFunction?.value) {
      const [Red, Green, Blue] = getRGB(channelFunction.value);
      htmlElement.style.setProperty("--UV", `${cssUV || 0}`);
      htmlElement.style.setProperty("--Red", `${Red || 0}`);
      htmlElement.style.setProperty("--Green", `${Green || 0}`);
      htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
      htmlElement.style.setProperty("--White", `0`);
      return;
    }
  }

  // strobe with color value
  if (Strobe && Strobe > 0) {
    const strobe = findFunction(channelFunctions, ChannelSimpleFunction.strobe);
    if (strobe?.value) {
      const [Red, Green, Blue] = getRGB(strobe.value);
      htmlElement.style.setProperty("--UV", `${cssUV || 0}`);
      htmlElement.style.setProperty("--Red", `${Red || 0}`);
      htmlElement.style.setProperty("--Green", `${Green || 0}`);
      htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
      htmlElement.style.setProperty("--White", `0`);
      return;
    }
  }

  // Additive mixing of all colour channels
  let r = 0, g = 0, b = 0, w = 0;
  for (const { hex, dmxValue } of colourChannels) {
    if (isRGBFixture && hasWhiteChannel && hex === "ffffff") {
      w = Math.max(w, dmxValue);
    } else {
      const [cr, cg, cb] = getRGB(hex);
      r = Math.min(255, r + cr * (dmxValue / 255));
      g = Math.min(255, g + cg * (dmxValue / 255));
      b = Math.min(255, b + cb * (dmxValue / 255));
    }
  }

  htmlElement.style.setProperty("--UV", `${cssUV || 0}`);
  htmlElement.style.setProperty("--Red", `${Math.round(r)}`);
  htmlElement.style.setProperty("--Green", `${Math.round(g)}`);
  htmlElement.style.setProperty("--Blue", `${Math.round(b)}`);
  htmlElement.style.setProperty("--White", `${Math.round(w)}`);
};
