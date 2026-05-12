import ReactDOM from "react-dom/client";
import "../index.css";
import { BasicPage } from "../ui/layout/basic-page";
import { ListWithAction } from "../ui/list-with-actions";
import { useSceneBlocks } from "../context/venues";
import { useMemo, useState } from "react";
import { SAMPLE_SCENE, Scene } from "../context/scenes";
import { useTagsStore } from "../components/stage/tags/tags";
import { CreateRule } from "../domain/scene/createRule";
import { useFixtures } from "../context/fixtures";
import { TagsRow } from "../domain/tags/row";
import { AddTag } from "../domain/tags/addTag";
import { SceneRules } from "../domain/scene/rules";

const SceneBlocksPage = () => {
  const [scene, setScene] = useState<Scene>(SAMPLE_SCENE);

  const sceneBlocks = useSceneBlocks((state) => state.blocks);

  const sceneBlocksList = useMemo(() => {
    return Object.values(sceneBlocks);
  }, [sceneBlocks]);

  const original = !sceneBlocks[scene.id];

  const stageFixtureTags = useTagsStore((t) => t.tags["stage-fixture"]);

  const fixtures = useFixtures((v) => v.fixtures);
  const tags = useMemo(() => {
    const keys = {
      all: "*",

      ...stageFixtureTags?.reduce((acc, tag) => {
        return {
          ...acc,
          [tag]: `.${tag}`,
        };
      }, {}),
    };

    return Object.keys(keys).map((key) => ({
      label: key,
      value: keys[key as keyof typeof keys],
    }));
  }, [stageFixtureTags]);

  const fixtureTags = useMemo<{ label: string; value: string }[]>(() => {
    return fixtures.map((fixture) => ({
      label: fixture.model,
      value: `@${fixture.id}`,
    }));
  }, [fixtures]);

  const fixtureMap = useMemo(
    () => Object.fromEntries(fixtures.map((f) => [f.id, f.model])),
    [fixtures],
  );
  const formatSelector = (selector: string) =>
    selector
      .split(" ")
      .map((t) => (t.startsWith("@") ? (fixtureMap[t.slice(1)] ?? t) : t))
      .join(" ");

  const [activeSelector, setActiveSelector] = useState<string | undefined>("*");
  const [secondarySelector, setSecondarySelector] = useState<string | undefined>();

  return (
    <BasicPage
      header={
        <>
          <a href="/">Back</a>
          <h2>Scene Blocks</h2>
          <input
            onChange={(e) => {
              setScene((state) => ({
                ...state,
                name: e.target.value,
              }));
            }}
            value={scene.name}
          />
          <button
            onClick={() => {
              useSceneBlocks.setState((state) => ({
                ...state,
                blocks: {
                  ...state.blocks,
                  [scene.id]: scene,
                },
              }));
            }}
          >
            {original ? "Save As" : "Save"}
          </button>
          <button
            onClick={() => {
              setScene(SAMPLE_SCENE);
            }}
          >
            New
          </button>
        </>
      }
      left={
        <>
          <ListWithAction
            items={sceneBlocksList}
            actions={[
              {
                name: "edit",
                onClick: (v) => {
                  setScene(v);
                },
              },
              {
                name: "delete",
                onClick: (sceneBlock) => {
                  setScene(SAMPLE_SCENE);
                  useSceneBlocks.setState((state) => {
                    delete state.blocks[sceneBlock.id];
                    return {
                      ...state,
                      blocks: { ...state.blocks },
                    };
                  });
                },
              },
            ]}
          />
        </>
      }
    >
      <div>Fixtures</div>

      <TagsRow
        active={activeSelector}
        tags={fixtureTags}
        setActive={setActiveSelector}
      />
      <div>Tags</div>
      <TagsRow
        active={activeSelector}
        tags={tags}
        setActive={setActiveSelector}
      />
      <div>
        <AddTag />
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        {activeSelector && (
          <CreateRule
            label={formatSelector(activeSelector)}
            fixtures={fixtures}
            new_profiles={scene.new_profiles[activeSelector]}
            setProfiles={(profilesFunc) => {
              setScene((state) => {
                const profiles =
                  typeof profilesFunc === "function"
                    ? profilesFunc(state.new_profiles[activeSelector] || [])
                    : profilesFunc;
                return {
                  ...state,
                  new_profiles: { ...state.new_profiles, [activeSelector]: profiles },
                };
              });
            }}
          />
        )}
        {secondarySelector && (
          <CreateRule
            label={formatSelector(secondarySelector)}
            fixtures={fixtures}
            new_profiles={scene.new_profiles[secondarySelector]}
            setProfiles={(profilesFunc) => {
              setScene((state) => {
                const profiles =
                  typeof profilesFunc === "function"
                    ? profilesFunc(state.new_profiles[secondarySelector] || [])
                    : profilesFunc;
                return {
                  ...state,
                  new_profiles: { ...state.new_profiles, [secondarySelector]: profiles },
                };
              });
            }}
          />
        )}
      </div>

      <div>
        <div>All Rules</div>
        <SceneRules
          activeSelector={activeSelector}
          secondarySelector={secondarySelector}
          setSecondarySelector={setSecondarySelector}
          scene={scene}
          fixtures={fixtures}
          onClick={(selector) => {
            setActiveSelector(selector);
            setSecondarySelector(undefined);
          }}
          onDelete={(selector) => {
            setScene((state) => {
              const new_profiles = { ...state.new_profiles };
              delete new_profiles[selector];
              return { ...state, new_profiles };
            });
            if (selector === activeSelector) setActiveSelector(undefined);
            if (selector === secondarySelector) setSecondarySelector(undefined);
          }}
        />
      </div>
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SceneBlocksPage />,
);
