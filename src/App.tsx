import { useEffect } from "react";
import styles from "./App.module.css";
// import { FixtureContext } from "./context/fixtures";
// import { Fixtures } from "./domain/fixtures/list";
// import { Stage } from "./components/stage";
// import { Venue } from "./components/venue";
import { useScenes } from "./context/scenes";
import { useVenues } from "./context/venues";
// import { GenericLight } from "./components/generic-light";
// import { CreateGenericProfile } from "./components/createGenericProfile";
// import { Globals } from "./components/globals";
// import { connect, startDMX } from "./dmx";
import { GlobalTypes, useGlobals } from "./context/globals";
// import { Controller } from "./components/controller/controller";
// import { useUI } from "./context/ui";
// import { HotSpots } from "./components/hot-spots/hot-spots";
import { useActiveScene } from "./context/active-scene";
import { BasicPage } from "./ui/layout/basic-page";
import { NewStage } from "./components/stage/new-stage";
import { NewStageFixture } from "./components/stage/new-state-fixture";
import { ListWithAction } from "./ui/list-with-actions";
// import { Controller } from "./components/controller/controller";
import { Globals } from "./components/globals";
import { ConnectedLight } from "./components/connectedLight";
import { useFixtures } from "./context/fixtures";
import { Controller } from "./components/controller/controller";
import { useProfiles } from "./context/profiles";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("venue_id");

function App() {
  const venue = useVenues((state) => state.venues.find((v) => v.id === id));
  const fixtures = useFixtures((state) => state.fixtures);
  const scenes = useScenes((state) => state.scenes);
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const { setActiveScenes, activeScene } = useActiveScene((state) => state);

  const activeSceneIds = useGlobals(
    (state) => state.values["ActiveScene"]?.value as string[]
  ) as string[];

  useEffect(() => {
    if (activeSceneIds) {
      const scene = activeSceneIds
        .map((id) => scenes.find((s) => s.id === id))
        .filter((a) => !!a);
      setActiveScenes(scene);
    }
  }, [scenes, activeSceneIds, setActiveScenes]);

  return (
    <BasicPage
      header={
        <>
          <button>
            <a href="/fixtures" target="_blank">
              Fixtures
            </a>
          </button>
          <button>
            <a href={`/venue?venue_id=${venue?.id}`} target="_blank">
              Edit Venue
            </a>
          </button>
          <button>
            <a target="_blank" href={`/scene?venue_id=${venue?.id}`}>
              Scenes
            </a>
          </button>
          <button
            onClick={() => {
              useProfiles.persist.rehydrate();
              useFixtures.persist.rehydrate();
              useVenues.persist.rehydrate();
              useScenes.persist.rehydrate();
            }}
          >
            Reload
          </button>
        </>
      }
      left={
        <>
          <div className={styles.scenes}>
            <ListWithAction
              items={scenes}
              actions={[
                {
                  name: "edit",
                  onClick: (s) => {
                    window
                      .open(
                        `/scene?venue_id=${venue?.id}&scene_id=${s.id}`,
                        "_blank"
                      )
                      ?.focus();
                  },
                },
                {
                  name: "apply",
                  disabled: (s) => s.id === activeScene?.id,
                  onClick: (s) => {
                    setGlobalValue("ActiveScene", {
                      type: GlobalTypes.scene,
                      value: [s.id],
                    });
                  },
                },
              ]}
            />
          </div>
        </>
      }
    >
      <NewStage>
        {venue?.venueFixtures.map((venueFixture) => {
          // either the ID is defined OR it tries to find by tags
          // const directProfileIds = activeScene?.profiles[venueFixture.id];

          // const tagProfileIds = venueFixture.tags.reduce(
          //   (profileIds, tag) => {
          //     if (activeScene?.profiles[tag]) {
          //       return [...profileIds, ...activeScene.profiles[tag]];
          //     }
          //     return profileIds;
          //   },
          //   [] as string[]
          // );
          // const profileIds = directProfileIds || tagProfileIds;

          // const subProfiles = profileIds
          //   .map((id) => profiles.find((p) => p.id == id))
          //   .filter((a) => !!a) as GenericProfile[];

          // const profileIds = activeScene
          //   ? activeScene.profiles[venueFixture.id] ||
          //     venueFixture.tags.reduce((profileIds, tag) => {
          //       if (activeScene.profiles[tag]) {
          //         return [...profileIds, ...(activeScene.profiles[tag] || [])];
          //       }
          //       return profileIds;
          //     }, [] as string[])
          //   : [];

          // const activeProfiles = profileIds
          //   .map((id) => profiles.find((p) => p.id == id))
          //   .filter((a) => !!a) as GenericProfile[];

          const fixture = fixtures.find((f) => f.id === venueFixture.fixtureId);

          if (!fixture) {
            return <button>Delete</button>;
          }

          return (
            <ConnectedLight
              venueFixture={venueFixture}
              channel={venueFixture.channel}
              fixture={fixture}
              key={venueFixture.id}
              scene={activeScene}
            >
              <NewStageFixture
                venueFixture={venueFixture}
                info={
                  <>
                    <div>{fixture.model}</div>
                    {/* {subProfiles?.map((prof) => (
                        <button
                          key={prof.id}
                          className={styles.button}
                          onClick={() => {
                            if (!activeScene) return;

                            // if (activeScene.profiles[venueFixture.id]) {
                            //   const newProfiles = profileIds.filter(
                            //     (p) => p != prof.id
                            //   );

                            //   updateScene({
                            //     ...activeScene,
                            //     profiles: {
                            //       ...activeScene.profiles,
                            //       [venueFixture.id]:
                            //         newProfiles.length === 0
                            //           ? undefined
                            //           : newProfiles,
                            //     },
                            //   });
                            // }
                          }}
                        >
                          {prof.name}
                        </button>
                      ))} */}
                  </>
                }
              />
            </ConnectedLight>
          );
        })}
      </NewStage>

      <Controller />

      {/* <Tempo /> */}

      {/* <SetColour /> */}

      {/* <SetScene /> */}

      {/* <SetScene /> */}

      <Globals />

      {/* {activeScene && venue && <HotSpots scene={activeScene} venue={venue} />} */}
    </BasicPage>
  );
}

export default App;
