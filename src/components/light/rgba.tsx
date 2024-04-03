import {
  // ChannelSimpleFunction,
  // ColourMode,
  DMXValues,
  Fixture,
} from "../../context/fixtures";
import styles from "./light.module.scss";
import {
  setCSSVarsFromDmx,
} from "../../utils";
import { useEffect, useRef } from "react";

export const RGBA = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
}) => {
  // const { Brightness, Strobe } = useMemo<
  //   Record<ChannelSimpleFunction, number | undefined>
  // >(() => {
  //   return visibleChannelFunctions.reduce((all, option) => {
  //     const channel = Object.keys(fixture.channelFunctions).find((i) => {
  //       const channel = fixture.channelFunctions[parseInt(i)];

  //       return Object.keys(channel).find((j) => {
  //         const subChannel = channel[parseInt(j)];

  //         if (subChannel.function == option) {
  //           // console.log(option, channel, subChannel, dmxValues?.[parseInt(i)]);
  //           return true;
  //         }

  //         return false;
  //       });
  //     });

  //     const value =
  //       channel && dmxValues ? dmxValues[parseInt(channel)] : undefined;

  //     return {
  //       ...all,
  //       [option as ChannelSimpleFunction]: value,
  //     };
  //   }, {} as Record<ChannelSimpleFunction, number | undefined>);
  // }, [dmxValues, fixture]);

  // console.log(dmxValues)

  // console.log(fixture.channelFunctions, dmxValues)

  // console.log(red);

  // const colours =
  //   dmxValues &&
  //   Object.keys(dmxValues).reduce((colours, _channelId) => {
  //     const channelId = parseInt(_channelId);
  //     const dmxValue = dmxValues?.[channelId];

  //     const match = Object.keys(fixture.channelFunctions[channelId]).find(
  //       (_channelFunctionId) => {
  //         const channelFunctionId = parseInt(_channelFunctionId);

  //         const channelFunction =
  //           fixture.channelFunctions[channelId][channelFunctionId];

  //         return (
  //           channelFunction.function === ChannelSimpleFunction.colour &&
  //           dmxValue >= channelFunction.range[0] &&
  //           dmxValue <= channelFunction.range[1]
  //         );
  //       }
  //     );

  //     if (match !== undefined) {
  //       const func = fixture.channelFunctions[channelId][parseInt(match)];

  //       const funcColours =
  //         typeof func.value === "string" && getRGB(func.value);

  //       const mappedColours =
  //         funcColours &&
  //         (funcColours.map((c) => {
  //           return Math.round(
  //             mapNumbers(func.range[0], func.range[1], dmxValue, 0, c)
  //             // mapNumbers(0, c, dmxValue, func.range[0], func.range[1])
  //           );
  //         }) as [number, number, number]);

  //       if (mappedColours) {
  //         return [...colours, mappedColours];
  //       }
  //     }
  //     return colours;
  //   }, [] as [number, number, number][]);

  // const trueColour = colours
  //   ?.reduce(
  //     (rgb, colour) => {
  //       if (colour[0]) {
  //         rgb[0].push(colour[0]);
  //       }
  //       if (colour[1]) {
  //         rgb[1].push(colour[1]);
  //       }
  //       if (colour[2]) {
  //         rgb[2].push(colour[2]);
  //       }

  //       return rgb;
  //     },
  //     [[], [], []] as [number[], number[], number[]]
  //   )
  //   .map((color) => {
  //     return color.length ? color.reduce((a, b) => a + b, 0) / color.length : 0;
  //   });

  // const [Red, Green, Blue] =
  //   fixture.colour && fixture.colourMode === ColourMode.single
  //     ? getRGB(fixture.colour)
  //     : trueColour || [0, 0, 0];

  // const cssBrightness = (!Red && !Green && !Blue ? 0 : Brightness) / 255;

  // console.log(Brightness, cssBrightness);

  // const cssBrightnessWhite = (!White ? 0 : Brightness) / 255;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !dmxValues) return;

    setCSSVarsFromDmx(ref.current, fixture, dmxValues);
  }, [dmxValues, fixture]);

  return (
    <div className={`${styles[fixture.fixtureShape]}`} ref={ref}>
      <div className={styles.inner}></div>
    </div>
  );
};
