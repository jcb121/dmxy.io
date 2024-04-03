import { useEffect, useRef } from "react";
import { DMXValues, Fixture } from "../../context/fixtures";
import { setCSSVarsFromDmx } from "../../utils";
import styles from "./light.module.scss";

export const Strobe = ({
  fixture,
  dmxValues,
}: {
  fixture: Fixture;
  dmxValues?: DMXValues;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !dmxValues) return;

    setCSSVarsFromDmx(ref.current, fixture, dmxValues);
  }, [dmxValues, fixture]);

  return (
    <div ref={ref} className={`${styles.Strobe} ${styles[fixture.fixtureShape]}`}>
      <div className={styles.inner}></div>
    </div>
  );
};
