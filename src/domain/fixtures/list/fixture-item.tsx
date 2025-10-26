import { Fixture } from "../../../context/fixtures";
import styles from "./fixtures.module.scss";
import { FixtureComponent } from "../fixture";

export const FixtureItem = ({
  f,
  onDrag,
}: {
  onDrag: (fixture: Fixture, e: React.DragEvent<HTMLDivElement>) => void;
  f: Fixture;
}) => {
  return (
    <div className={styles.fixture}>
      <div>{`${f.model} (${f.channelFunctions.length}ch)`}</div>

      <div className={styles.dragWrapper}>
        <div
          draggable
          onDragStart={(e) => onDrag(f, e)}
          className={styles.drag}
        >
          <FixtureComponent fixture={f} />
        </div>
      </div>
    </div>
  );
};
