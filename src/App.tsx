// import styles from "./App.module.css";
import { Scene, useScenes } from "./context/scenes";
import { useActiveVenue, useVenues } from "./context/venues";
import { BasicPage } from "./ui/layout/basic-page";
import { NewStage } from "./components/stage/new-stage";
import { NewStageFixture } from "./components/stage/new-state-fixture";
import { ConnectedLight } from "./components/connectedLight";
import { useFixtures } from "./context/fixtures";
import { SceneGrid } from "./domain/scenes/grid";
import { useActiveScene } from "./context/active-scene";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCalcDmx } from "./utils/useCalcDmx";
import { useEvents } from "./context/events";
import { Button } from "./components/button";
import { SelectController } from "./domain/controller/select";
import { Controllers } from "./domain/controller/controllers";
import { DmxDevicePills } from "./domain/dmx-devices/pills";

const urlParams = new URLSearchParams(window.location.search);
const venue_id = urlParams.get("venue_id");

venue_id && useActiveVenue.getState().setActiveVenue(venue_id);

function App() {
  const venues = useVenues((state) => state.venues);
  useEffect(() => {
    venue_id && useActiveVenue.getState().setActiveVenue(venue_id);
  }, [venues]);

  const venue = useActiveVenue((state) => state.venue);
  useEffect(() => {
    useActiveVenue.setState((state) => ({
      ...state,
      venue,
    }));
  }, [venue]);

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

  const { stageWidth = 600, stageHeight = 400 } = useSearch({ from: "/main.html" });
  const navigate = useNavigate({ from: "/main.html" });

  const [showStage, setShowStage] = useState(false);

  const [activeAreaIndex, setActiveAreaIndex] = useState(0);
  const venueAreas = useMemo(() => {
    return (
      venue?.venueFixtures.reduce((acc, vf) => {
        return [...new Set([...acc, vf.area || 0])];
      }, [] as number[]) || [0]
    );
  }, [venue]);

  const editMode = useEvents((state) => state.editMode);

  return (
    <BasicPage
      header={
        <>
          <Button href="/fixtures.html" target="_blank">
            Fixtures
          </Button>
          <Button href={`/venue.html?venue_id=${venue?.id}`} target="_blank">
            Edit Venue
          </Button>
          <Button target="_blank" href={`/scene.html?venue_id=${venue?.id}`}>
            Scenes
          </Button>
          <Button
            onClick={() => {
              setShowStage((state) => !state);
            }}
          >
            {showStage ? "hide stage" : "show stage"}
          </Button>

          <SelectController />

          <Button
            onClick={() => {
              useEvents.setState((state) => ({
                ...state,
                editMode: !state.editMode,
              }));
            }}
          >
            {editMode ? "Finish Editing Controllers" : "Edit Controllers"}
          </Button>
        </>
      }
      headerRight={<DmxDevicePills />}
      left={
        <SceneGrid
          scenes={venue?.scenes ? Object.values(venue.scenes) : []}
          scene={activeScene}
        />
      }
    >
      {showStage && (
        <>
          {venueAreas.length > 1 && (
            <div>
              <button
                onClick={() => {
                  setActiveAreaIndex((state) => {
                    if (state < 1) return 0;
                    return state - 1;
                  });
                }}
              >
                Prev Area
              </button>
              {venueAreas[activeAreaIndex]}
              <button
                onClick={() => {
                  setActiveAreaIndex((state) => {
                    if (state < venueAreas.length - 1) {
                      return state + 1;
                    }
                    return state;
                  });
                }}
              >
                Next Area
              </button>
            </div>
          )}
          <NewStage
            resizable
            width={stageWidth}
            height={stageHeight}
            onResize={({ width, height }) =>
              navigate({
                search: (prev) => ({ ...prev, stageWidth: width, stageHeight: height }),
              })
            }
            venueFixtures={venue?.venueFixtures.filter(
              (vf) =>
                (vf.area === undefined && venueAreas[activeAreaIndex] === 0) ||
                vf.area === venueAreas[activeAreaIndex],
            )}
          >
            {venue?.venueFixtures.map((venueFixture) => {
              if (
                venueFixture.area === undefined &&
                venueAreas[activeAreaIndex] !== 0
              ) {
                return null;
              }
              if (
                venueFixture.area !== undefined &&
                venueFixture.area !== venueAreas[activeAreaIndex]
              ) {
                return null;
              }
              const fixture = fixtures.find(
                (f) => f.id === venueFixture.fixtureId,
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
        </>
      )}

      <Controllers />
    </BasicPage>
  );
}

export default App;
