import { useContext } from "react";
import { FixtureContext } from "../../context/fixtures";
import styles from "./fixtureProfiles.module.scss";
import { Light } from "../light";
import { CreateFixtureProfile } from "../createFixtureProfile";

export const FixtureProfiles = ({ fixtureId }: { fixtureId: string }) => {
  const { fixtureProfiles } = useContext(FixtureContext);

  const { fixtures } = useContext(FixtureContext);
  const fixture = fixtures.find((f) => f.id === fixtureId);

  if (!fixture) return null;

  return (
    <div className={styles.root}>
      <div>Profiles</div>
      {fixtureProfiles.map((profile) => {
        // const mode = fixtureProfiles[parseInt(profileId)];
        return (
          <div key={profile.id} className={styles.row}>
            <span>{profile.name}</span>
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("profileId", profile.id);
                console.log("Settings", "profileId", profile.id);
              }}
              className={styles.drag}
            >
              <Light
                fixture={fixture}
                dmxValues={profile.dmxValues}
                small={true}
              />
            </div>
          </div>
        );
      })}

      <hr></hr>

      <CreateFixtureProfile fixture={fixture} />
    </div>
  );
};
