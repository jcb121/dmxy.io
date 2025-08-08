import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { useVenues, Venue } from "../context/venues";
import { useFixtures } from "../context/fixtures";
import { NewStage } from "../components/stage/new-stage";
import { NewStageFixture } from "../components/stage/new-state-fixture";
import { useState } from "react";
import {
  GenericProfile,
  ProfileProvier,
  useProfiles,
} from "../context/profiles";
import { SAMPLE_SCENE, Scene, useScenes } from "../context/scenes";
import {
  CreateGenericProfile,
  defaultState,
} from "../components/createGenericProfile";
import { HotSpots } from "../components/hot-spots/hot-spots";
import { ConnectedLight } from "../components/connectedLight";
import { ListWithAction } from "../ui/list-with-actions";
import { useGlobals } from "../context/globals";

const urlParams = new URLSearchParams(window.location.search);
const venue_id = urlParams.get("venue_id");
const scene_id = urlParams.get("scene_id");

const _venue = useVenues.getState().venues.find((v) => v.id === venue_id);
const _scene = useScenes.getState().scenes.find((s) => s.id === scene_id);

const CreateScene = () => {
  const [scene, setScene] = useState<Scene>(_scene || SAMPLE_SCENE());
  const [venue] = useState<Venue>(_venue);

  const fixtures = useFixtures((s) => s.fixtures);
  const original = useVenues((state) =>
    state.venues.find((a) => a.id == venue.id)
  );
  const profiles = useProfiles((state) => state.profiles);

  const deleteProfile = useProfiles((state) => state.remove);

  const addScene = useScenes((state) => state.add);
  const deleteScene = useScenes((state) => state.remove);

  const scenes = useScenes((state) => state.scenes);
  const globalValues = useGlobals((state) => state.values);

  const [profile, setProfile] = useState<GenericProfile>(
    defaultState(Object.keys(globalValues))
  );

  return (
    <BasicPage
      header={
        <>
          <h4>{venue?.name}</h4>
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
              if (original) {
                const url = new URL(window.location.href);
                url.searchParams.set("scene_id", scene.id);
                window.history.pushState(null, "", url);
              }
              addScene(scene);
            }}
          >
            {original ? "Save" : "Save As"}
          </button>
        </>
      }
      left={
        <>
          <div>
            <h5>Profiles:</h5>
            <ListWithAction
              items={profiles}
              actions={[
                {
                  name: "edit",
                  onClick: (profile) => {
                    setProfile(profile);
                  },
                },
                {
                  name: "delete",
                  onClick: (profile) => {
                    deleteProfile(profile);
                  },
                },
              ]}
            >
              {(item) => (
                <button
                  data-testid={item.id}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("profileId", item.id);
                  }}
                >
                  Drag
                </button>
              )}
            </ListWithAction>

            <div>
              <span>
                <h5>Scenes</h5>
              </span>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("scene_id");
                  window.history.pushState(null, "", url);

                  setScene(SAMPLE_SCENE());
                }}
              >
                Create New Scene
              </button>
            </div>
            <ListWithAction
              items={scenes}
              actions={[
                {
                  name: "edit",
                  onClick: (scene) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("scene_id", scene.id);
                    window.history.pushState(null, "", url);
                    setScene(scene);
                  },
                },
                {
                  name: "delete",
                  onClick: (scene) => {
                    deleteScene(scene);
                  },
                },
              ]}
            />
          </div>
        </>
      }
    >
      <HotSpots venue={venue} scene={scene} setScene={setScene} />

      <NewStage>
        {venue.venueFixtures.map((venueFixture) => {
          const fixture = fixtures.find((f) => f.id === venueFixture.fixtureId);
          if (!fixture) return;

          // connected light means it's linked to the DMX STATE
          return (
            <ConnectedLight
              venueFixture={venueFixture}
              key={venueFixture.id}
              channel={venueFixture.channel}
              fixture={fixture}
              scene={scene}
            >
              <NewStageFixture
                key={venueFixture.id}
                // onDrag={(e) => {
                //   e.dataTransfer.setData("id", venueFixture.id);
                // }}
                onDrop={(e) => {
                  const profileId = e.dataTransfer.getData("profileId");
                  const profile = profiles.find((p) => p.id === profileId);
                  if (profile) {
                    console.log("dropped profile", profile);

                    const currentProfileIds =
                      scene.profiles[venueFixture.id] || [];

                    setScene({
                      ...scene,
                      profiles: {
                        ...scene.profiles,
                        [venueFixture.id]: [...currentProfileIds, profile.id],
                      },
                    });
                  }
                }}
                info={
                  <>
                    <div>{`${fixture.model} (${fixture.channelFunctions.length})`}</div>

                    {scene.profiles[venueFixture.id] && (
                      <div>
                        {scene.profiles[venueFixture.id]?.map((p, index) => (
                          <button
                            key={`${p}-${index}`}
                            onClick={() => {
                              setScene((state) => {
                                state.profiles[venueFixture.id]?.splice(
                                  index,
                                  1
                                );

                                return {
                                  ...state,
                                  profiles: {
                                    ...state.profiles,
                                    [venueFixture.id]: [
                                      ...(state.profiles[venueFixture.id] ||
                                        []),
                                    ],
                                  },
                                };
                              });
                            }}
                          >
                            {profiles.find((profile) => profile.id === p)?.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                }
                venueFixture={venueFixture}
              />
            </ConnectedLight>
          );
        })}
      </NewStage>

      <CreateGenericProfile profile={profile} setProfile={setProfile} />
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ProfileProvier>
    <CreateScene />
  </ProfileProvier>
);
