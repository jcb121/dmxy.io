import { useMemo } from "react";
import {
  ChannelSimpleFunction,
  DMXValues,
  Fixture,
  visibleChannelFunctions,
} from "../../context/fixtures";
import styles from "./light.module.scss";

const mapNumbers = (A: number, B: number, X: number, C: number, D: number) =>
  ((X - A) / (B - A)) * (D - C) + C;

export const Light = ({
  fixture,
  dmxValues,
  small,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
  small?: boolean;
}) => {
  const { Red, Blue, Brightness, Green, Strobe, White } = useMemo<
    Record<ChannelSimpleFunction, number>
  >(() => {
    return visibleChannelFunctions.reduce((all, option) => {
      const channel = Object.keys(fixture.channelFunctions).find((i) => {
        const channel = fixture.channelFunctions[parseInt(i)];

        return Object.keys(channel).find((j) => {
          const subChannel = channel[parseInt(j)];

          if (subChannel.function == option) {
            // console.log(option, channel, subChannel, dmxValues?.[parseInt(i)]);
            return true;
          }

          return false;
        });
      });

      const value = channel && dmxValues ? dmxValues[parseInt(channel)] : 0;

      return {
        ...all,
        [option as ChannelSimpleFunction]: value,
      };
    }, {} as Record<ChannelSimpleFunction, number>);
  }, [dmxValues, fixture]);

  const cssBrightness = (!Red && !Green && !Blue ? 0 : Brightness) / 255;

  const cssBrightnessWhite = (!White ? 0 : Brightness) / 255;

  const cssStobeTime = Strobe === 0 ? 0 : mapNumbers(0, 255, Strobe, 1000, 0);

  return (
    <div
      className={`${small ? styles.small : ""} ${styles[fixture.fixtureShape]}`}
    >
      <div
        className={styles.inner}
        style={{
          // borderColor: `rgba(${Red},${Green},${Blue}, ${cssBrightness})`,
          animationDuration: `${cssStobeTime}ms` || undefined,
          borderColor: `rgba(${Red},${Green},${Blue}, ${cssBrightness})`,
          background: `rgba(${White},${White},${White}, ${cssBrightnessWhite})`,
        }}
      ></div>
    </div>
  );
};
