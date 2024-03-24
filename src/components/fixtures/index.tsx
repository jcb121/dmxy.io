import { useState } from "react";
import { Fixture } from "../../context/fixtures";
import { FixtureProfiles } from "../fixtureProfiles";
import styles from "./fixtures.module.scss";
import { Light } from "../light";

export const Fixtures = ({ fixtures }: { fixtures: Fixture[] }) => {
  const [addModes, setAddModes] = useState(false);

  return (
    <ul className={styles.root}>
      {fixtures.map((f) => {
        return (
          <li key={f.id} className={styles.item}>
            <div className={styles.fixture}>
              <button
                className={styles.button}
                onClick={() => setAddModes((state) => !state)}
              >
                {!addModes ? "↓" : "↑"}
              </button>
              <div>
                {`
              ${f.model} (${f.channels}ch)
              `}
              </div>
              <div className={styles.dragWrapper}>
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("fixtureId", f.id);
                    console.log("Settings", "fixtureId", f.id)

                  }}
                  className={styles.drag}
                >
                  <Light fixture={f} />
                </div>
              </div>
            </div>

            {addModes ? <FixtureProfiles fixtureId={f.id} /> : null}
          </li>
        );
      })}
    </ul>
  );
};
