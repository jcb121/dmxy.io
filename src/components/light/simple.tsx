import { useEffect, useRef } from "react";
import { DMXValues, Fixture } from "../../context/fixtures";
import { setCSSVarsFromDmx } from "../../utils";
import styles from "./light.module.scss";

export const Simple = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
}) => {
  // const Brightness = getCSSBrightness(fixture.channelFunctions, dmxValues);

  // const [Red, Green, Blue] = fixture.colour
  //   ? getRGB(fixture.colour)
  //   : [];

  // const cssBrightness = (!Red && !Green && !Blue ? 0 : Brightness) / 255;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !dmxValues) return;

    setCSSVarsFromDmx(ref.current, fixture, dmxValues);
  }, [dmxValues, fixture]);

  return (
    <div className={`${styles[fixture.fixtureShape]}`}>
      <div className={styles.inner}></div>
    </div>
  );
};
