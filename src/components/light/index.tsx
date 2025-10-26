import { Fixture } from "../../context/fixtures";

import styles from "./styles.module.scss";
import { RGBAWUV } from "./rgbaw-uv";

export const Light = ({ fixture }: { fixture: Fixture }) => {
  return (
    <div className={styles[fixture.fixtureShape]}>
      <RGBAWUV />
    </div>
  );
};
