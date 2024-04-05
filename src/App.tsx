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
import { GenericLight } from "./components/generic-light";
import { CreateGenericProfile } from "./components/createGenericProfile";
import { Globals } from "./components/globals";
import { connect, startDMX } from "./dmx";
import { GlobalTypes, useGlobals } from "./context/globals";
import { Controller } from "./components/controller/controller";
import { useUI } from "./context/ui";

function App() {
  const editMode = useUI((state) => state.venueEditMode);
  const setVenueEditMode = useUI((state) => state.setVenueEditMode);

  const { fixtures, saveFixture } = useContext(FixtureContext);
  const { venues, saveVenue, updateVenue } = useContext(VenueContext);
  const { scenes, updateScene, saveScene, createScene, reloadScenes } =
    useContext(SceneContext);
  const { profiles, reloadProfiles } = useContext(ProfileContext);
  const [showFixture, setShowFixture] = useState(false);
  const [showProfiles, setShowProfiles] = useState(true);
  const activeScenes = useGlobals(
    (state) => state.values["ActiveScene"]?.value as string[]
  ) as string[];

  const activeSceneId = activeScenes[activeScenes.length - 1];

  const setGlobalValue = useGlobals((state) => state.setGlobalValue);

  const scene = activeSceneId
    ? scenes.find((s) => s.id === activeSceneId)
    : undefined;
  const venue = venues[0] as VenueType | undefined;

  if (!scene || !venue) return null;

  return (
    <div className={styles.root}>
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

        <button
          onClick={() => {
            setVenueEditMode(!editMode);
          }}
        >
          Venue Edit Mode
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

      <div className={styles.body}>
        {showFixture && (
          <div className={styles.left}>
            <Fixtures fixtures={fixtures} />
            <CreateFixture onSubmit={saveFixture} />
          </div>
        )}

        {showProfiles && (
          <div className={styles.left}>
            <div className={styles.genericProfiles}>
              <button onClick={reloadProfiles}>
                <div className={styles.leftTitle}>Profiles ⟳</div>
              </button>

              {profiles.map((profile) => {
                return (
                  <div key={profile.name} className={styles.genericProfile}>
                    <div className={styles.genericProfileName}>
                      {profile.name}
                    </div>
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

            <button onClick={reloadScenes}>
              <div className={styles.leftTitle}>Secenes ⟳</div>
            </button>

            {scenes &&
              scenes.map((s) => (
                <button
                  disabled={s.id === activeSceneId}
                  key={s.id}
                  onClick={() => {
                    setGlobalValue("ActiveScene", {
                      type: GlobalTypes.scene,
                      value: [s.id],
                    });
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

          <Controller />

          {/* <Tempo /> */}

          {/* <SetColour /> */}

          {/* <SetScene /> */}

          {/* <SetScene /> */}

          <Globals />

          {/* <div className={styles.bottom}> */}
          <CreateGenericProfile />
          {/* </div> */}
        </div>

        <div className={styles.right}>
          <Venue />
        </div>
      </div>
    </div>
  );
}

export default App;
