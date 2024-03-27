import {
  DMXValues,
  Fixture,
} from "../../context/fixtures";
import { getCSSStrobeDuration, getRGB } from "../../utils";
import styles from "./light.module.scss";

export const Strobe = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
}) => {
  // console.log(dmxValues);
  const Strobe = getCSSStrobeDuration(fixture.channelFunctions, dmxValues);

  const [Red, Green, Blue] = fixture.colour
    ? getRGB(fixture.colour)
    : [255, 255, 255];

  // console.log(Strobe);

  return (
    <div className={`${styles[fixture.fixtureShape]}`}>
      <div
        className={styles.inner}
        style={{
          animationDuration: `${Strobe}ms` || undefined,
          borderColor: `rgba(${Red},${Green},${Blue}, ${Strobe === 0 ? 0 : 1})`,
          background: `rgba(${Red},${Green},${Blue}, ${Strobe === 0 ? 0 : 1})`,
        }}
      ></div>
    </div>
  );
};
