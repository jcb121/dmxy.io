import { Light } from "../../../components/light";
import {
  // ChannelSimpleFunction,
  // ColourMode,
  DMXValues,
  Fixture as FixtureType,
} from "../../../context/fixtures";

import styles from "./styles.module.scss";

export const FixtureComponent = ({
  fixture,
  dmxValues,
}: {
  /**
   * This shouldn't change during a performance
   */
  fixture: FixtureType;
  /**
   * This is more for testing, you should pass the colours via CSS vars
   */
  dmxValues?: DMXValues;
}) => {
  return (
    <div className={styles[fixture.fixtureShape]}>
      <Light dmxValues={dmxValues} fixture={fixture} />
      {/* COULD BE A SMOKE MACHINE */}
      {/* COULD BE A GIMBLE LIGHT */}
    </div>
  );
};
