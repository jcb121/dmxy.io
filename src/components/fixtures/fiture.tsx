import { Fixture as FictureType } from "../../context/fixtures";
import { Light } from "../light";
import styles from "./fixtures.module.scss";

export const Fixture = ({ f }: { f: FictureType }) => {
  return (
    <div className={styles.fixture}>
      {/* <button
        className={styles.button}
        onClick={() => setAddModes((state) => !state)}
      >
        {!addModes ? "↓" : "↑"}
      </button> */}
      {/* {addModes ? <FixtureProfiles fixtureId={f.id} /> : null} */}

      <div>{`${f.model} (${f.channels}ch)`}</div>
      <div className={styles.dragWrapper}>
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("fixtureId", f.id);
            console.log("Settings", "fixtureId", f.id);
          }}
          className={styles.drag}
        >
          <Light fixture={f} />
        </div>
      </div>
    </div>
  );
};
