import {
  ChannelSimpleFunction,
  ColourMode,
  DMXValues,
  Fixture,
} from "../../context/fixtures";
import styles from "./light.module.scss";
import { RGBA } from "./rgba";
import { Simple } from "./simple";
import { Strobe } from "./strobe";



export const Light = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
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
    fixture.colourMode === ColourMode.rgba ||
    fixture.colourMode === ColourMode.rgb
  ) {
    return <RGBA fixture={fixture} dmxValues={dmxValues} />;
  }

  return <div>no match</div>;

  // const Red = 0;
  // const Blue = 0;
  // const White = 0;
  // const Green = 0;
};
