import { memo } from "react";
import {
  ChannelSimpleFunction,
  ColourMode,
  DMXValues,
  Fixture,
} from "../../context/fixtures";
// import styles from "./light.module.scss";
import { RGBA } from "./rgba";
import { Simple } from "./simple";
import { Strobe } from "./strobe";

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
  const funcs = Object.values(fixture.channelFunctions).reduce(
    (funcs, channel) => {
      return [
        ...funcs,
        ...Object.values(channel).reduce(
          (_funcs, func) => [..._funcs, func.function],
          [] as ChannelSimpleFunction[]
        ),
      ];
    },
    [] as ChannelSimpleFunction[]
  );

  if (funcs.length === 1) {
    if (funcs[0] === ChannelSimpleFunction.brightness) {
      return <Simple fixture={fixture} dmxValues={dmxValues} />;
    } else if (funcs[0] === ChannelSimpleFunction.strobe) {
      return <Strobe fixture={fixture} dmxValues={dmxValues} />;
    }
  }

  if (
    fixture.colourMode === ColourMode.rgbw ||
    fixture.colourMode === ColourMode.rgb
  ) {
    return <RGBA fixture={fixture} dmxValues={dmxValues} />;
  }

  return <div>no match</div>;
};

export const Light = memo(_Light);
