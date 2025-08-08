import { memo } from "react";
import {
  // ChannelSimpleFunction,
  // ColourMode,
  DMXValues,
  Fixture,
} from "../../context/fixtures";
// import styles from "./light.module.scss";
import { RGBA } from "./rgba";
// import { Simple } from "./simple";
// import { Strobe } from "./strobe";

export const _Light = ({
  fixture,
  dmxValues,
}: {
  /**
   * This shouldn't change during a performance
   */
  fixture: Fixture;
  /**
   * This is more for testing, you should pass the colours via CSS vars
   */
  dmxValues?: DMXValues;
}) => {
  // const light = useMemo(() => {
  //   const red = fixture.channelFunctions.find((channel) =>
  //     channel.find((a) => a.function === ChannelSimpleFunction.red)
  //   );
  //   const blue = fixture.channelFunctions.find((channel) =>
  //     channel.find((a) => a.function === ChannelSimpleFunction.blue)
  //   );
  //   const green = fixture.channelFunctions.find((channel) =>
  //     channel.find((a) => a.function === ChannelSimpleFunction.green)
  //   );

  //   if (red || green || blue) {
  //     return "RGB";
  //   }
  // }, [fixture]);
  // const funcs = Object.values(fixture.channelFunctions).reduce(
  //   (funcs, channel) => {
  //     return [
  //       ...funcs,
  //       ...Object.values(channel).reduce(
  //         (_funcs, func) => [..._funcs, func.function],
  //         [] as ChannelSimpleFunction[]
  //       ),
  //     ];
  //   },
  //   [] as ChannelSimpleFunction[]
  // );

  // if (funcs.length === 1) {
  //   if (funcs[0] === ChannelSimpleFunction.brightness) {
  //     return <Simple fixture={fixture} dmxValues={dmxValues} />;
  //   } else if (funcs[0] === ChannelSimpleFunction.strobe) {
  //     return <Strobe fixture={fixture} dmxValues={dmxValues} />;
  //   }
  // }

  // if (light === "RGB") {
  return <RGBA fixture={fixture} dmxValues={dmxValues} />;
};

export const Light = memo(_Light);
