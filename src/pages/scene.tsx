import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { useActiveVenue } from "../context/venues";
import { useFixtures } from "../context/fixtures";
import { NewStage } from "../components/stage/new-stage";
import { NewStageFixture } from "../components/stage/new-state-fixture";
import { useMemo, useState } from "react";
import { ProfileProvier } from "../context/profiles";
import { SAMPLE_SCENE, Scene } from "../context/scenes";
import { ConnectedLight } from "../components/connectedLight";

import { ScenesList } from "../domain/scenes/list";
import { TagsRow } from "../domain/tags/row";
import { SceneRules } from "../domain/scene/rules";
import { CreateRule } from "../domain/scene/createRule";
import { SceneVars } from "../domain/scene/sceneVars";
import { useCalcDmx } from "../utils/useCalcDmx";
import { useDmx } from "../context/dmx";

const urlParams = new URLSearchParams(window.location.search);
const venue_id = urlParams.get("venue_id");
const scene_id = urlParams.get("scene_id");

venue_id && useActiveVenue.getState().setActiveVenue(venue_id);

const CreateScene = () => {
  const venue = useActiveVenue((state) => state.venue);
  const addScene = useActiveVenue((state) => state.addScene);

  const [scene, setScene] = useState<Scene>(
    (scene_id && venue?.scenes[scene_id]) || SAMPLE_SCENE()
  );

  const fixtures = useFixtures((s) => s.fixtures);
  const [activeSelector, setActiveSelector] = useState<string>();

  const original = !!venue?.scenes[scene.id];
  const tags = useMemo<{ label: string; value: string }[]>(() => {
    if (!venue) return [];

    const keys = {
      all: "*",
      none: "",

      ...venue.venueFixtures
        .map((vf) => vf.tags)
        .flat()
        .reduce(
          (tags, tag) => ({
            ...tags,
            [tag]: `.${tag}`,
          }),
          {}
        ),

      ...venue.venueFixtures
        .map((vf) => fixtures.find((f) => f.id === vf.fixtureId))
        .filter((a) => !!a)
        .reduce((tags, fixture) => {
          return {
            ...tags,
            [fixture.model]: `@${fixture?.id}`,
          };
        }, {}),
    };

    return Object.keys(keys).map((key) => ({
      label: key,
      value: keys[key as keyof typeof keys],
    }));
  }, [venue, fixtures]);

  const handleSave = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("scene_id", scene.id);
    window.history.pushState(null, "", url);

    addScene(scene);
  };

  const handleNew = () => {
    const scene = SAMPLE_SCENE();

    const url = new URL(window.location.href);
    url.searchParams.set("scene_id", scene.id);
    window.history.pushState(null, "", url);

    setScene(scene);
  };

  const scenes = (venue?.scenes && Object.values(venue.scenes)) || [];

  useCalcDmx(scene, venue?.venueFixtures);

  const { start } = useDmx();

  return (
    <BasicPage
      header={
        <>
          <input
            onChange={(e) => {
              setScene((state) => ({
                ...state,
                name: e.target.value,
              }));
            }}
            value={scene.name}
          />
          <button onClick={handleSave}>{original ? "Save" : "Save As"}</button>
          <button onClick={handleNew}>New</button>
        </>
      }
      headerRight={
        <button
          onClick={() => {
            start();
          }}
        >
          DMX Connect
        </button>
      }
      left={
        <>
          <div>
            <ScenesList scenes={scenes} setScene={setScene} />
          </div>
        </>
      }
    >
      <div>
        <h5>Selectors</h5>
        <TagsRow
          active={activeSelector}
          tags={tags}
          onClick={(selector) => {
            setActiveSelector(selector);
          }}
        />
      </div>

      <div>
        <NewStage>
          {venue?.venueFixtures.map((venueFixture) => {
            const fixture = fixtures.find(
              (f) => f.id === venueFixture.fixtureId
            );
            if (!fixture) return;

            // connected light means it's linked to the DMX STATE
            return (
              <ConnectedLight
                venueFixture={venueFixture}
                fixture={fixture}
                key={venueFixture.id}
              >
                <NewStageFixture
                  onClick={() => {
                    setActiveSelector(`#${venueFixture.id}`);
                  }}
                  key={venueFixture.id}
                  info={
                    <>
                      <div>{`${fixture.model} (${fixture.channelFunctions.length})`}</div>
                      <TagsRow
                        active={activeSelector}
                        tags={venueFixture.tags.map((t) => ({
                          value: `.${t}`,
                          label: t,
                        }))}
                        onClick={(selector) => {
                          setActiveSelector(selector);
                        }}
                      />
                    </>
                  }
                  venueFixture={venueFixture}
                />
              </ConnectedLight>
            );
          })}
        </NewStage>
      </div>

      <div>
        <SceneVars vars={scene.vars} setScene={setScene} />
      </div>

      {venue && activeSelector && (
        <CreateRule
          venue={venue}
          activeSelector={activeSelector}
          new_profiles={scene.new_profiles[activeSelector]}
          setProfiles={(profilesFunc) => {
            setScene((state) => {
              const profiles =
                typeof profilesFunc === "function"
                  ? profilesFunc(state.new_profiles[activeSelector] || [])
                  : profilesFunc;

              return {
                ...state,
                new_profiles: {
                  ...state.new_profiles,
                  [activeSelector]: profiles,
                },
              };
            });
          }}
        />
      )}

      <div>
        <h5>Rules</h5>
        <SceneRules
          scene={scene}
          setScene={setScene}
          onClick={(selector) => {
            setActiveSelector(selector);
          }}
        />
      </div>
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ProfileProvier>
    <CreateScene />
  </ProfileProvier>
);
