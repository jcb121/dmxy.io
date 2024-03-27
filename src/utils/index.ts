import {
  ChannelFunctions,
  ChannelSimpleFunction,
  DMXValues,
} from "../context/fixtures";

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

  // console.log(`B: ${bR},${bG},${bB}`);

  const rDiff = bR - aR;
  const gDiff = bG - aG;
  const bDiff = bB - aB;

  // console.log(`diff: ${rDiff},${gDiff},${bDiff}`);

  const distance = time / duration;

  // console.log("distance", distance);

  const r = Math.round(aR + rDiff * distance);
  const g = Math.round(aG + gDiff * distance);
  const b = Math.round(aB + bDiff * distance);

  return `${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
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

export const isWhite = (a: string) => {
  return (
    `${a[0]}${a[1]}` === `${a[2]}${a[3]}` &&
    `${a[0]}${a[1]}` === `${a[4]}${a[5]}`
  );
};

export const getCSSBrightness = (
  channelFunctions: ChannelFunctions,
  dmxValues?: DMXValues
) =>
  Object.keys(channelFunctions).reduce((brightness, _channelId) => {
    const channelId = parseInt(_channelId);
    const channel = channelFunctions[channelId];
    const func = Object.values(channel).find(
      (subFunc) => subFunc.function === ChannelSimpleFunction.brightness
    );
    if (!func || !dmxValues) return brightness;
    const res = mapNumbers(
      func.range[0],
      func.range[1],
      dmxValues[channelId],
      0,
      1
    );
    // console.log('BRIGHTNESS', res)
    return res;
  }, 0);

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

export const getRGBColours = (
  channelFunctions: ChannelFunctions,
  dmxValues: DMXValues
): Record<string, number> => {
  const res = Object.keys(channelFunctions).reduce((colours, _channelId) => {
    const channelId = parseInt(_channelId);
    const channel = channelFunctions[channelId];
    const dmxValue = dmxValues[channelId];

    const colorFunc = Object.values(channel).find(
      (subFunc) => subFunc.function === ChannelSimpleFunction.colour
    );
    if (colorFunc?.value) {
      const val = mapNumbers(
        colorFunc.range[0],
        colorFunc.range[1],
        dmxValue,
        0,
        255
      );

      return {
        [colorFunc?.value]: val,
        ...colours,
      };
    }

    return colours;
  }, {});

  // console.log("RES", res);

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

export const mapRGBASToDMX = (
  channelFunctions: ChannelFunctions,
  targetColour: string,
  brightness: number,
  strobe: number
): DMXValues => {
  const targetRGB = getRGB(targetColour);

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

        if (channelFunction.function === ChannelSimpleFunction.brightness) {
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

        if (
          channelFunction.function === ChannelSimpleFunction.colour &&
          channelFunction.value &&
          channelFunction.value !== "ffffff"
        ) {
          const channelRGB = getRGB(channelFunction.value);
          const R = mapNumbers(0, 255, targetRGB[0], 0, channelRGB[0]);
          const G = mapNumbers(0, 255, targetRGB[1], 0, channelRGB[1]);
          const B = mapNumbers(0, 255, targetRGB[2], 0, channelRGB[2]);

          return Math.round(
            mapNumbers(
              0,
              255,
              R + G + B,
              channelFunction.range[0],
              channelFunction.range[1]
            )
          );
        }

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
