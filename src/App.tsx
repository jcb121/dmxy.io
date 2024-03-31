import { useContext, useState } from "react";
import styles from "./App.module.css";
import { CreateFixture } from "./components/createFixture";
import { FixtureContext } from "./context/fixtures";
import { Fixtures } from "./components/fixtures";
import { Stage } from "./components/stage";
import { Venue } from "./components/venue";
import { SceneContext } from "./context/scenes";
import { Venue as VenueType, VenueContext } from "./context/venues";
import { ProfileContext } from "./context/profiles";
// import { Light } from "./components/light";
import { GenericLight } from "./components/generic-light";
import { CreateGenericProfile } from "./components/createGenericProfile";
import { Globals } from "./components/globals";
import { Tempo } from "./components/tempo/tempo";
import { SetScene } from "./components/set-scene";
import { connect, startDMX } from "./dmx";
import { SetColour } from "./components/set-color/set-color";

function App() {
  const { fixtures, saveFixture } = useContext(FixtureContext);
  const { venues, saveVenue, updateVenue } = useContext(VenueContext);
  const {
    scenes,
    updateScene,
    saveScene,
    activeScene,
    createScene,
    setActiveScene,
  } = useContext(SceneContext);
  const { profiles } = useContext(ProfileContext);
  const [showFixture, setShowFixture] = useState(false);
  const [showProfiles, setShowProfiles] = useState(true);

  // console.log('venues[0]', venues[0], scenes[0])

  const scene = activeScene
    ? scenes.find((s) => s.id === activeScene)
    : undefined;
  const venue = venues[0] as VenueType | undefined;
  // const [port, setPort] = useState<SerialPort>();

  if (!scene || !venue) return null;

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

        <button
          onClick={async () => {
            const port = await connect();
            if (port) {
              // setPort(port);
              startDMX(port);
            }
          }}
        >
          DMX Connect
        </button>
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
                  <div key={profile.name}>
                    {profile.name}
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.left}>
          <div className={styles.scenes}>
            <button
              onClick={() => {
                createScene();
              }}
            >
              Create new scene
            </button>
            <hr></hr>

            {scenes &&
              scenes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScene(s.id);
                  }}
                >
                  {s.name}
                </button>
              ))}
          </div>
        </div>

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

          <Tempo />

          <SetColour />

          <SetScene />

          <SetScene />

          <Globals />

          {/* <div className={styles.bottom}> */}
          <CreateGenericProfile />
          {/* </div> */}
        </div>
        <div className={styles.right}>
          <Venue />
        </div>
      </div>
    </>
  );
}

export default App;
