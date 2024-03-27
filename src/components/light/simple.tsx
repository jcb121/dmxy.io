import {
  DMXValues,
  Fixture,
} from "../../context/fixtures";
import { getCSSBrightness, getRGB } from "../../utils";
import styles from "./light.module.scss";

export const Simple = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
}) => {
  const Brightness = getCSSBrightness(fixture.channelFunctions, dmxValues);

  const [Red, Green, Blue] = fixture.colour
    ? getRGB(fixture.colour)
    : [255, 255, 255];

  // const cssBrightness = (!Red && !Green && !Blue ? 0 : Brightness) / 255;

  return (
    <div className={`${styles[fixture.fixtureShape]}`}>
      <div
        className={styles.inner}
        style={{
          borderColor: `rgba(${Red},${Green},${Blue}, ${Brightness})`,
          background: `rgba(${Red},${Green},${Blue}, ${Brightness})`,
        }}
      ></div>
    </div>
  );
};
