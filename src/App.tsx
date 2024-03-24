import { useContext } from "react";
import styles from "./App.module.css";
import { CreateFixture } from "./components/createFixture";
import { FixtureContext } from "./context/fixtures";
import { Fixtures } from "./components/fixtures";
import { Stage } from "./components/stage";
import { Venue } from "./components/venue";
import { Scene, SceneContext } from "./context/scenes";
import { Venue as VenueType, VenueContext } from "./context/venues";

function App() {
  const { fixtures, saveFixture } = useContext(FixtureContext);
  const { venues, saveVenue, updateVenue } = useContext(VenueContext);
  const { scenes, updateScene, saveScene } = useContext(SceneContext);

  const scene = scenes[0] as Scene | undefined;
  const venue = venues[0] as VenueType | undefined;

  return (
    <>
      <div className={styles.header}>
        <CreateFixture onSubmit={saveFixture} />
      </div>

      <div className={styles.root}>
        <div className={styles.left}>
          <Fixtures fixtures={fixtures} />
        </div>
        <div className={styles.main}>
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
              venue && saveVenue(venue);
            }}
          >
            Save Venue
          </button>
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
