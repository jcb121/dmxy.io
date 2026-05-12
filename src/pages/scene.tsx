import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { useActiveVenue, useSceneBlocks } from "../context/venues";
import { Fixture, useFixtures } from "../context/fixtures";
import { NewStage } from "../components/stage/new-stage";
import { NewStageFixture } from "../components/stage/new-state-fixture";
import { useMemo, useState } from "react";
import { SAMPLE_SCENE, Scene } from "../context/scenes";
import { ConnectedLight } from "../components/connectedLight";

import { ScenesList } from "../domain/scenes/list";
import { TagsRow } from "../domain/tags/row";
import { CreateRule } from "../domain/scene/createRule";
import { SceneVars } from "../domain/scene/sceneVars";
import { useCalcDmx } from "../utils/useCalcDmx";
import { useDmx } from "../context/dmx";
import { usePageGlobals } from "../context/globals";
import { SceneRules } from "../domain/scene/rules";
import { ButtonRow } from "../components/buttons/button-row";
import { mergeScenes } from "../domain/scenes/merge";

const urlParams = new URLSearchParams(window.location.search);
const venue_id = urlParams.get("venue_id");
const scene_id = urlParams.get("scene_id");

venue_id && useActiveVenue.getState().setActiveVenue(venue_id);

const CreateScene = () => {
  const venue = useActiveVenue((state) => state.venue);
  const addScene = useActiveVenue((state) => state.addScene);
  const deleteScene = useActiveVenue((state) => state.deleteScene);

  const [scene, setScene] = useState<Scene>(
    (scene_id && venue?.scenes[scene_id]) || SAMPLE_SCENE(),
  );

  const fixtures = useFixtures((s) => s.fixtures);
  const sceneBlocks = useSceneBlocks((s) => s.blocks);
  const currentFixtures = useMemo<Fixture[]>(() => {
    return (
      venue?.venueFixtures.reduce((acc, vf) => {
        const found = fixtures.find((f) => f.id === vf.fixtureId);

        if (found && !acc.find((f) => f.id === found.id)) {
          return [...acc, found];
        }

        return [...acc];
      }, [] as Fixture[]) || []
    );
  }, [fixtures, venue]);

  const [activeSelector, setActiveSelector] = useState<string>();

  const original = !!venue?.scenes[scene.id];
  const tags = useMemo<{ label: string; value: string }[]>(() => {
    if (!venue) return [];

    const keys = {
      all: "*",
      // none: "",

      ...venue.venueFixtures
        .map((vf) => vf.tags)
        .flat()
        .reduce(
          (tags, tag) => ({
            ...tags,
            [tag]: `.${tag}`,
          }),
          {},
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

  useCalcDmx(scene, venue?.venueFixtures, usePageGlobals);

  const { start } = useDmx();

  const [activeArea, setActiveArea] = useState(0);

  const [stageSize, setStageSize] = useState(() => ({
    width: Number(urlParams.get("stageWidth")) || 600,
    height: Number(urlParams.get("stageHeight")) || 400,
  }));

  return (
    <BasicPage
      header={
        <>
          <input
            placeholder="Scene Name"
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
        <>
          <div>
            <button
              onClick={() => {
                setActiveArea((state) => {
                  if (state < 1) return 0;
                  return state - 1;
                });
              }}
            >
              Prev Area
            </button>
            {activeArea}
            <button
              onClick={() => {
                setActiveArea((state) => {
                  return state + 1;
                });
              }}
            >
              Next Area
            </button>
          </div>
          <button
            onClick={() => {
              start();
            }}
          >
            DMX Connect
          </button>
        </>
      }
      left={
        <>
          <div>
            <ScenesList
              scenes={scenes}
              setScene={setScene}
              deleteScene={deleteScene}
            />
          </div>
        </>
      }
    >
      <TagsRow
        data-testid="all-tags"
        active={activeSelector}
        tags={tags}
        setActive={setActiveSelector}
      />

      <NewStage
        resizable
        width={stageSize.width}
        height={stageSize.height}
        onResize={({ width, height }) => {
          setStageSize({ width, height });
          const url = new URL(window.location.href);
          url.searchParams.set("stageWidth", String(width));
          url.searchParams.set("stageHeight", String(height));
          window.history.replaceState(null, "", url);
        }}
        venueFixtures={venue?.venueFixtures.filter(
          (vf) =>
            (vf.area === undefined && activeArea === 0) ||
            vf.area === activeArea,
        )}
      >
        {venue?.venueFixtures.map((venueFixture) => {
          if (venueFixture.area === undefined && activeArea !== 0) {
            return null;
          }
          if (
            venueFixture.area !== undefined &&
            venueFixture.area !== activeArea
          ) {
            return null;
          }
          const fixture = fixtures.find((f) => f.id === venueFixture.fixtureId);
          if (!fixture) return;
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
                      setActive={setActiveSelector}
                    />
                  </>
                }
                venueFixture={venueFixture}
              />
            </ConnectedLight>
          );
        })}
      </NewStage>

      <div>
        <SceneVars vars={scene.vars} setScene={setScene} />
      </div>

      <ButtonRow
        items={Object.values(sceneBlocks).map((s) => ({
          ...s,
          label: s.name,
          value: s.id,
        }))}
        onClick={({ value }) => {
          if (!activeSelector) return;

          const sceneBlock = sceneBlocks[value];

          // const newProfiles = Object.keys(sceneBlock.new_profiles).reduce(
          //   (rules, selector) => {
          //     let newSelector = selector;

          //     if (activeSelector !== selector) {
          //       if (selector === "*") {
          //         newSelector = activeSelector;
          //       } else if (activeSelector === "*") {
          //         newSelector = selector; // already being set
          //       } else {
          //         newSelector = `${activeSelector} ${selector}`;
          //       }
          //     }

          //     return {
          //       [newSelector]: sceneBlock.new_profiles[selector],
          //       ...rules,
          //     };
          //   },
          //   {} as Scene["new_profiles"],
          // );

          setScene((state) => {
            return mergeScenes(state, sceneBlock, activeSelector);

            // return {
            //   ...state,
            //   new_profiles: {
            //     ...state.new_profiles,
            //     ...newProfiles,
            //   },
            // };
          });
        }}
      />

      {venue && activeSelector && (
        <CreateRule
          fixtures={currentFixtures}
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
          activeSelector={activeSelector}
          secondarySelector={undefined}
          setSecondarySelector={() => {}}
          onClick={(selector) => setActiveSelector(selector)}
          onDelete={(selector) => {
            setScene((state) => {
              const new_profiles = { ...state.new_profiles };
              delete new_profiles[selector];
              return { ...state, new_profiles };
            });
            if (selector === activeSelector) setActiveSelector(undefined);
          }}
        />
      </div>
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<CreateScene />);
