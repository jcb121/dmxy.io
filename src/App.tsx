// import styles from "./App.module.css";
import { Scene, useScenes } from "./context/scenes";
import { useActiveVenue } from "./context/venues";
import { BasicPage } from "./ui/layout/basic-page";
import { NewStage } from "./components/stage/new-stage";
import { NewStageFixture } from "./components/stage/new-state-fixture";
import { ConnectedLight } from "./components/connectedLight";
import { useFixtures } from "./context/fixtures";
import { Controller } from "./components/controller/controller";
import { useProfiles } from "./context/profiles";
import { SceneGrid } from "./domain/scenes/grid";
import { useActiveScene } from "./context/active-scene";
import { useEffect, useState } from "react";
import { useCalcDmx } from "./utils/useCalcDmx";
import { useEvents } from "./context/events";
import { useDmx } from "./context/dmx";

const urlParams = new URLSearchParams(window.location.search);
const venue_id = urlParams.get("venue_id");

venue_id && useActiveVenue.getState().setActiveVenue(venue_id);

function App() {
  const venue = useActiveVenue((state) => state.venue);
  useEffect(() => {
    if (venue) {
      useScenes.setState({
        scenes: Object.values(venue.scenes),
      });
    }
  }, [venue]);

  const fixtures = useFixtures((state) => state.fixtures);
  const activeScenes = useActiveScene((state) => state.activeScenes);
  const activeScene = activeScenes[0] as Scene | undefined;

  useCalcDmx(activeScene, venue?.venueFixtures);
  const connect = useDmx();

  const [showStage, setShowStage] = useState(true);

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
            }}
          >
            Reload
          </button>
          <button
            onClick={() => {
              setShowStage((state) => !state);
            }}
          >
            Stage
          </button>
          <button
            onClick={() => {
              useEvents.setState((state) => ({
                ...state,
                editMode: !state.editMode,
              }));
            }}
          >
            Edit Controller Function
          </button>
        </>
      }
      headerRight={<button onClick={connect}>DMX Connect</button>}
    >
      <SceneGrid
        scenes={venue?.scenes ? Object.values(venue.scenes) : []}
        scene={activeScene}
      />
      {showStage && (
        <NewStage>
          {venue?.venueFixtures.map((venueFixture) => {
            const fixture = fixtures.find(
              (f) => f.id === venueFixture.fixtureId
            );

            if (!fixture) {
              return <button>Delete</button>;
            }

            return (
              <ConnectedLight
                venueFixture={venueFixture}
                fixture={fixture}
                key={venueFixture.id}
              >
                <NewStageFixture
                  venueFixture={venueFixture}
                  info={<div>{fixture.model}</div>}
                />
              </ConnectedLight>
            );
          })}
        </NewStage>
      )}

      <Controller />
    </BasicPage>
  );
}

export default App;
