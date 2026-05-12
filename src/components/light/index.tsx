import { Fixture } from "../../context/fixtures";

import styles from "./styles.module.scss";
import { RGBAWUV } from "./rgbaw-uv";

// this component is more like LightShape
export const Light = ({ fixture }: { fixture: Fixture }) => {
  return (
    <div className={styles[fixture.fixtureShape]}>
      <RGBAWUV />
    </div>
  );
};
