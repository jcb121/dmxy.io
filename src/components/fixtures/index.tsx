import { Fixture as FictureType } from "../../context/fixtures";
import styles from "./fixtures.module.scss";
import { Fixture } from "./fiture";

export const Fixtures = ({ fixtures }: { fixtures: FictureType[] }) => {

  return (
    <ul className={styles.root}>
      {fixtures.map((f) => {
        return (
          <li key={f.id} className={styles.item}>
            <Fixture f={f} />

          </li>
        );
      })}
    </ul>
  );
};
