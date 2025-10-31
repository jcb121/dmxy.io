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

export const setCSSVarsFromDmx = (
  htmlElement: HTMLDivElement,
  { channelFunctions, deviceFunctions }: Fixture,
  universe: number | undefined = DEFAULT_DMX_UNIVERSE,
  channelNumber: number
) => {
  const channels = dmxToFrame(channelFunctions, universe, channelNumber);
  const { Red, Blue, Green, White, Strobe, Intensity, Colour, UV } = channels;

  const cssStobeTime = getCSSStrobeDuration(Strobe);
  const cssBrightness = getCSSBrightness(Intensity);
  const cssUV = getUVBrightness(UV);

  const activeFunction = deviceFunctions?.find((df) => {
    return Object.keys(df.values).find((key) => {
      return channels[key] === df.values[key];
    });
  });

  htmlElement.style.setProperty("--Label", `"${activeFunction?.label || ""}"`);

  // tilt is from 0 to 255.
  // htmlElement.style.setProperty("--Tilt", `${(Tilt / 255) * 100 - 50 || 0}px`);
  htmlElement.style.setProperty("--Brightness", `${cssBrightness}`);
  htmlElement.style.setProperty("--StrobeTime", `${cssStobeTime}ms`);
  // incase it is fixed colour
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
        func.range[0] <=  DMXState[universe][channelIndex + channelNumber - 1] &&
        DMXState[universe][channelIndex + channelNumber - 1] <= func.range[1]
    );

    if (channelFunction?.value) {
      const [Red, Green, Blue] = getRGB(channelFunction.value);
      htmlElement.style.setProperty("--UV", `${cssUV || 0} `);
      htmlElement.style.setProperty("--Red", `${Red || 0} `);
      htmlElement.style.setProperty("--Green", `${Green || 0}`);
      htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
      htmlElement.style.setProperty("--White", `${White || 0}`);
      return;
    }
  }

  if (Colour && Colour > 0) {
    const color = findFunction(channelFunctions, ChannelSimpleFunction.colour);

    if (color?.value) {
      const [Red, Green, Blue] = getRGB(color.value);
      htmlElement.style.setProperty("--UV", `${cssUV || 0} `);
      htmlElement.style.setProperty("--Red", `${Red || 0} `);
      htmlElement.style.setProperty("--Green", `${Green || 0}`);
      htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
      htmlElement.style.setProperty("--White", `${White || 0}`);

      return;
    }
  }

  if (Strobe && Strobe > 0) {
    const strobe = findFunction(channelFunctions, ChannelSimpleFunction.strobe);
    if (strobe?.value) {
      const [Red, Green, Blue] = getRGB(strobe.value);
      htmlElement.style.setProperty("--UV", `${cssUV || 0} `);
      htmlElement.style.setProperty("--Red", `${Red || 0} `);
      htmlElement.style.setProperty("--Green", `${Green || 0}`);
      htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
      htmlElement.style.setProperty("--White", `${White || 0}`);
      return;
    }
  }

  htmlElement.style.setProperty("--UV", `${cssUV || 0} `);
  htmlElement.style.setProperty("--Red", `${Red || 0} `);
  htmlElement.style.setProperty("--Green", `${Green || 0}`);
  htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
  htmlElement.style.setProperty("--White", `${White || 0}`);
};
