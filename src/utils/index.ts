import {
  ChannelFunctions,
  ChannelSimpleFunction,
  SubChannelFunction,
  DMXValues,
  Fixture,
} from "../context/fixtures";
import { ProfileState } from "../context/profiles";

export const animateRGB = (
  [aR, aG, aB]: [number, number, number],
  [bR, bG, bB]: [number, number, number],
  duration: number,
  time: number
): [number, number, number] => {
  const rDiff = bR - aR;
  const gDiff = bG - aG;
  const bDiff = bB - aB;

  const distance = time / duration;

  const r = Math.round(aR + rDiff * distance);
  const g = Math.round(aG + gDiff * distance);
  const b = Math.round(aB + bDiff * distance);

  return [r, g, b];
};

export const animateColour = (
  startColour: string,
  endColour: string,
  duration: number,
  time: number
) => {
  const aR = parseInt(`${startColour[0]}${startColour[1]}`, 16);
  const aG = parseInt(`${startColour[2]}${startColour[3]}`, 16);
  const aB = parseInt(`${startColour[4]}${startColour[5]}`, 16);

  // console.log(`A: ${aR},${aG},${aB}`);

  const bR = parseInt(`${endColour[0]}${endColour[1]}`, 16);
  const bG = parseInt(`${endColour[2]}${endColour[3]}`, 16);
  const bB = parseInt(`${endColour[4]}${endColour[5]}`, 16);

  const [r, g, b] = animateRGB([aR, aG, aB], [bR, bG, bB], duration, time);

  // console.log(`B: ${bR},${bG},${bB}`);

  // const rDiff = bR - aR;
  // const gDiff = bG - aG;
  // const bDiff = bB - aB;

  // console.log(`diff: ${rDiff},${gDiff},${bDiff}`);

  // const distance = time / duration;

  // console.log("distance", distance);

  // const r = Math.round(aR + rDiff * distance);
  // const g = Math.round(aG + gDiff * distance);
  // const b = Math.round(aB + bDiff * distance);

  return `${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const mapNumbers = (
  A: number,
  B: number,
  X: number,
  C: number,
  D: number
) => ((X - A) / (B - A)) * (D - C) + C;

export const getRGB = (colour: string): [number, number, number] => {
  const red = parseInt(`${colour[0]}${colour[1]}`, 16);
  const green = parseInt(`${colour[2]}${colour[3]}`, 16);
  const blue = parseInt(`${colour[4]}${colour[5]}`, 16);

  return [red, green, blue];
};

export const rgbToHex = ([r, g, b]: [number, number, number]) => {
  return `${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const isWhite = (a: string) => {
  return (
    `${a[0]}${a[1]}` === `${a[2]}${a[3]}` &&
    `${a[0]}${a[1]}` === `${a[4]}${a[5]}`
  );
};

export const getCSSBrightness = (
  channelFunctions: ChannelFunctions,
  dmxValues?: DMXValues
) => {
  const hasItensity = channelFunctions.find((c) =>
    c.find((f) => f.function === ChannelSimpleFunction.intensity)
  );

  if (!hasItensity) {
    return 1;
  }

  return channelFunctions.reduce((brightness, channel, index) => {
    const func = channel.find(
      (subFunc) => subFunc.function === ChannelSimpleFunction.intensity
    );
    if (!func || !dmxValues) return brightness;
    const res = mapNumbers(
      func.range[0],
      func.range[1],
      dmxValues[index],
      0,
      1
    );
    return res;
  }, 0);
};

export const getCSSStrobeDuration = (
  channelFunctions: ChannelFunctions,
  dmxValues?: DMXValues
) =>
  Object.keys(channelFunctions).reduce((strobeTime, _channelId) => {
    const channelId = parseInt(_channelId);
    const channel = channelFunctions[channelId];
    const func = Object.values(channel).find(
      (subFunc) => subFunc.function === ChannelSimpleFunction.strobe
    );
    if (!func || !dmxValues) return strobeTime;

    const res = dmxValues[channelId]
      ? mapNumbers(
          func.range[0],
          func.range[1],
          dmxValues[channelId],
          1000, // 1s
          100 // 100ms
        )
      : 0;
    // console.log("strobeTime", res);
    return res;
  }, 0);

export const mapDMXtoChannels = (
  channelFunctions: ChannelFunctions,
  dmxValues: DMXValues
): Record<string, number> => {
  const res = channelFunctions.reduce((colours, channel, index) => {
    const dmxValue = dmxValues[index];
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

// we want a colour and have a channel with that exact colour...
// if (
//   channelFunction.function === ChannelSimpleFunction.colour &&
//   fixture.colourMode === ColourMode.fixed &&
//   targetColour === channelFunction.value
// ) {
//   return Math.round(
//     mapNumbers(
//       0,
//       255,
//       targetBrightness,
//       channelFunction.range[0],
//       channelFunction.range[1]
//     )
//   );
// }

// export const combineRGBStrings = (red: string, green: string, blue: string) => {
//   return `${red.substring(0, 2)}${green.substring(2, 2)}${blue.substring(
//     4,
//     2
//   )}`;
// };

export const mapProfileStateToDMX = (
  channelFunctions: ChannelFunctions,
  profileSate: ProfileState
) => {
  const res = channelFunctions.reduce((dmxValues, channel, channelId) => {
    const channelValue = channel.reduce((channelValue, channelFunction) => {
      // sort for fixed colour first.
      if (channelFunction.function === ChannelSimpleFunction.fixedColour) {
        if (
          channelFunction.value ===
          rgbToHex([profileSate.Red, profileSate.Green, profileSate.Blue])
        ) {
          return channelFunction.range[0] + 1;
        }
      }
      // everything else acts the same...
      const targetState = profileSate[channelFunction.function];
      if (!targetState) return channelValue;
      return mapNumbers(
        0,
        255,
        targetState,
        channelFunction.range[0],
        channelFunction.range[1]
      );
    }, 0);

    return {
      ...dmxValues,
      [channelId]: channelValue,
    };
  }, {} as DMXValues);

  return res;
};

export const mapHexToDMX = (
  channelFunctions: ChannelFunctions,
  targetColour: string,
  brightness: number,
  strobe: number
): DMXValues => {
  const res = Object.keys(channelFunctions).reduce((dmxValues, _channelId) => {
    const channelId = parseInt(_channelId);
    const channel = channelFunctions[channelId];

    const channelValue = Object.keys(channel).reduce(
      (channelValue, _functionId) => {
        const functionId = parseInt(_functionId);
        const channelFunction = channel[functionId];

        if (channelFunction.function === ChannelSimpleFunction.strobe) {
          return strobe === 0
            ? 0
            : mapNumbers(
                0,
                255,
                strobe,
                channelFunction.range[0],
                channelFunction.range[1]
              );
        }

        if (channelFunction.function === ChannelSimpleFunction.intensity) {
          return brightness === 0
            ? 0
            : mapNumbers(
                0,
                255,
                brightness,
                channelFunction.range[0],
                channelFunction.range[1]
              );
        }

        if (channelFunction.function === ChannelSimpleFunction.red) {
          const red = parseInt(targetColour.substring(0, 2), 16);
          return mapNumbers(
            0,
            255,
            red,
            channelFunction.range[0],
            channelFunction.range[1]
          );
        }

        if (channelFunction.function === ChannelSimpleFunction.green) {
          const blue = parseInt(targetColour.substring(2, 4), 16);

          return mapNumbers(
            0,
            255,
            blue,
            channelFunction.range[0],
            channelFunction.range[1]
          );
        }

        if (channelFunction.function === ChannelSimpleFunction.blue) {
          const green = parseInt(targetColour.substring(4, 6), 16);

          return mapNumbers(
            0,
            255,
            green,
            channelFunction.range[0],
            channelFunction.range[1]
          );
        }

        // if (
        //   channelFunction.function === ChannelSimpleFunction.colour &&
        //   channelFunction.value &&
        //   channelFunction.value !== "ffffff"
        // ) {
        //   const channelRGB = getRGB(channelFunction.value);
        //   const R = mapNumbers(0, 255, targetRGB[0], 0, channelRGB[0]);
        //   const G = mapNumbers(0, 255, targetRGB[1], 0, channelRGB[1]);
        //   const B = mapNumbers(0, 255, targetRGB[2], 0, channelRGB[2]);

        //   return Math.round(
        //     mapNumbers(
        //       0,
        //       255,
        //       R + G + B,
        //       channelFunction.range[0],
        //       channelFunction.range[1]
        //     )
        //   );
        // }

        return channelValue;
      },
      0
    );

    return {
      ...dmxValues,
      [channelId]: channelValue,
    };
  }, {});

  return res;
};

export const setCSSVarsFromDmx = (
  htmlElement: HTMLDivElement,
  { channelFunctions }: Fixture,
  dmxValues: DMXValues
) => {
  // STOBE CODE =========================================================================
  const strobe = channelFunctions.reduce((channelFunction, c) => {
    if (channelFunction) return channelFunction;

    const found = c.find((f) => f.function === ChannelSimpleFunction.strobe);
    if (found) {
      return found;
    }
  }, undefined as SubChannelFunction<ChannelSimpleFunction, number, number> | undefined);

  const cssStobeTime = getCSSStrobeDuration(channelFunctions, dmxValues);

  // Special rule for a stobe with a set colour;
  if (strobe?.value) {
    const [Red, Green, Blue] =
      cssStobeTime > 0 ? getRGB(strobe.value) : [0, 0, 0];
    htmlElement.style.setProperty("--Red", `${Red || 0} `);
    htmlElement.style.setProperty("--Green", `${Green || 0}`);
    htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
    // htmlElement.style.setProperty("--White", `${White || 0}`);
    htmlElement.style.setProperty("--StrobeTime", `${cssStobeTime}ms`);
    return;
  }
  // FIXED COLOUR CODE ==================================================================
  const Brightness = getCSSBrightness(channelFunctions, dmxValues);

  const fixedColour = channelFunctions.reduce((channelFunction, c, index) => {
    if (channelFunction) return channelFunction;

    const found = c.find(
      (f) =>
        f.function === ChannelSimpleFunction.fixedColour &&
        dmxValues[index] > f.range[0] &&
        dmxValues[index] < f.range[1]
    );
    if (found) {
      return found;
    }
  }, undefined as SubChannelFunction<ChannelSimpleFunction, number, number> | undefined);

  // console.log("FIXED COLOUR", fixedColour);
  if (fixedColour?.value) {
    const [Red, Green, Blue] = getRGB(fixedColour.value);
    htmlElement.style.setProperty("--Red", `${Red || 0} `);
    htmlElement.style.setProperty("--Green", `${Green || 0}`);
    htmlElement.style.setProperty("--Blue", `${Blue || 0}`);

    htmlElement.style.setProperty("--Brightness", `${Brightness}`);
    htmlElement.style.setProperty("--StrobeTime", `${cssStobeTime}ms`);
    return;
  }

  // RGBA COLOUR CODE =====================================================================
  const {
    Red,
    Blue,
    Green,
    White,
    Tilt,
    // Pan,
    // ...result
    // Brightness, Storbe
  } = dmxValues
    ? mapDMXtoChannels(channelFunctions, dmxValues)
    : ({} as Record<string, number>);

  // console.log("RES", result);

  // tilt is from 0 to 255.

  htmlElement.style.setProperty("--Tilt", `${(Tilt / 255) * 100 - 50 || 0}px`);

  htmlElement.style.setProperty("--Red", `${Red || 0} `);
  htmlElement.style.setProperty("--Green", `${Green || 0}`);
  htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
  htmlElement.style.setProperty("--White", `${White || 0}`);

  // if (colourMode === ColourMode.single) {
  //   const [Red, Green, Blue] = colour ? getRGB(colour) : [];
  //   htmlElement.style.setProperty("--Red", `${Red || 0} `);
  //   htmlElement.style.setProperty("--Blue", `${Blue || 0}`);
  //   htmlElement.style.setProperty("--Green", `${Green || 0}`);
  // }

  htmlElement.style.setProperty("--Brightness", `${Brightness}`);
  htmlElement.style.setProperty("--StrobeTime", `${cssStobeTime}ms`);
};
