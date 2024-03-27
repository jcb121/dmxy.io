import { useContext, useState } from "react";
import styles from "./App.module.css";
import { CreateFixture } from "./components/createFixture";
import { FixtureContext } from "./context/fixtures";
import { Fixtures } from "./components/fixtures";
import { Stage } from "./components/stage";
import { Venue } from "./components/venue";
import { Scene, SceneContext } from "./context/scenes";
import { Venue as VenueType, VenueContext } from "./context/venues";
import { CreateGenericProfile } from "./components/createGenericProfile";
import { ProfileContext } from "./context/profiles";
// import { Light } from "./components/light";
import { GenericLight } from "./components/generic-light";

function App() {
  const { fixtures, saveFixture } = useContext(FixtureContext);
  const { venues, saveVenue, updateVenue } = useContext(VenueContext);
  const { scenes, updateScene, saveScene } = useContext(SceneContext);
  const { profiles } = useContext(ProfileContext);
  const scene = scenes[0] as Scene | undefined;
  const venue = venues[0] as VenueType | undefined;

  const [showFixture, setShowFixture] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  return (
    <>
      <div className={styles.header}>
        <input
          value={venue?.name}
          onChange={(e) => {
            venue &&
              updateVenue({
                ...venue,
                name: e.target.value,
              });
          }}
        />
        <button
          onClick={() => {
            setShowFixture((s) => !s);
          }}
        >
          Fixtures
        </button>
        <button
          onClick={() => {
            setShowProfiles((s) => !s);
          }}
        >
          Profiles
        </button>
        <button
          onClick={() => {
            venue && saveVenue(venue);
          }}
        >
          Save Venue
        </button>

        <span className={styles.spacer}></span>

        {/* <button onClick={() => {}}>⏸︎</button> */}

        <button onClick={() => {}}>DMX Connect</button>
      </div>

      <div className={styles.root}>
        {showFixture && (
          <div className={styles.left}>
            <Fixtures fixtures={fixtures} />
            <CreateFixture onSubmit={saveFixture} />
          </div>
        )}

        {showProfiles && (
          <div className={styles.left}>
            <div className={styles.genericProfiles}>
              {profiles.map((profile) => {
                return (
                  <div
                    key={profile.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("profileId", profile.id);
                      console.log("Settings", "profileId", profile.id);
                    }}
                  >
                    <GenericLight profile={profile} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.main}>
          <input
            value={scene?.name}
            onChange={(e) => {
              scene &&
                updateScene({
                  ...scene,
                  name: e.target.value,
                });
            }}
          />
          <button
            onClick={() => {
              scene && saveScene(scene);
            }}
          >
            Save Scene
          </button>
          <Stage scene={scene} />
          <div className={styles.bottom}>
            <CreateGenericProfile />
          </div>
        </div>
        <div className={styles.right}>
          <Venue />
        </div>
      </div>
    </>
  );
}

export default App;
