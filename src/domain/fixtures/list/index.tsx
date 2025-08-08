import { Fixture as FictureType, Fixture } from "../../../context/fixtures";
import styles from "./fixtures.module.scss";
import { FixtureItem } from "./fixture-item";

export const Fixtures = ({
  fixtures,
  onDrag,
}: {
  onDrag: (fixture: Fixture, e: React.DragEvent<HTMLDivElement>) => void;
  fixtures: FictureType[];
}) => {
  return (
    <ul className={styles.root}>
      {fixtures.map((f) => {
        return (
          <li key={f.id} className={styles.item}>
            <FixtureItem onDrag={onDrag} f={f} />
          </li>
        );
      })}
    </ul>
  );
};
