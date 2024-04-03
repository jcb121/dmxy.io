import React, { useCallback, useContext, useEffect, useState } from "react";
import { getDatabase } from "../db";
import { Venue, VenueContext } from "./venues";
import { GlobalTypes, useGlobals } from "./globals";

export type Scene = {
  // group can have multi profiles
  //  0 (left beflow): [prof1ID, prod2ID]
  profiles: Record<number, string[]>;

  // array of the groups
  // [ [ left ]  [mid]  [right]]
  fixtureGroups: Array<string[] | undefined>;
  id: string;
  name: string;
};

const SAMPLE_SCENE = () => ({
  fixtureGroups: [],
  id: crypto.randomUUID(),
  profiles: {},
  name: "New Scene",
});

export const SceneContext = React.createContext<{
  // activeScene?: string;
  // setActiveScene: (a: string) => void;
  scenes: Scene[];
  updateScene: (s: Scene) => void;
  saveScene: (s: Scene) => void;
  createScene: () => void;
}>({
  scenes: [],
  // setActiveScene: () => {},
  updateScene: () => {},
  saveScene: () => {},
  createScene: () => {},
});

export const SceneProvider = ({ children }: { children: React.ReactNode }) => {
  const { venues } = useContext(VenueContext);
  const venue = venues[0] as Venue | undefined;
  const setGlobalValue = useGlobals((state) => state.setGlobalValue);
  const activeScenes = useGlobals(
    (state) => state.values["ActiveScene"]?.value
  ) as string[];
  const activeScene = activeScenes[activeScenes.length - 1];

  const [scenes, setScenes] = useState<Scene[]>([]);

  const createScene = useCallback(() => {
    if (!venue) return;
    const sampleScene = SAMPLE_SCENE();

    const newScene = {
      ...sampleScene,
      fixtureGroups: [], //venue.venueFixtures.map((f) => [f.id]),
      profiles: venue.venueFixtures.reduce((profiles, _, index) => {
        profiles[index] = [];
        return profiles;
      }, {} as Record<number, string[]>),
    };

    setScenes((state) => [...state, newScene]);
    setGlobalValue("ActiveScene", {
      type: GlobalTypes.scene,
      value: [newScene.id],
    });
    saveScene(newScene);
  }, [venue, setGlobalValue]);

  useEffect(() => {
    if (scenes.length > 0) return;
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("scenes");
      console.log("GOT SCENES", data);

      if (data.length > 0) {
        setScenes(data);

        if (!activeScene) {
          console.log("Setting active scene to", data[0].id);
          setGlobalValue("ActiveScene", {
            type: GlobalTypes.scene,
            value: [data[0].id],
          });
        }
      } else {
        createScene();
      }
    })();
  }, [activeScene, scenes.length, setGlobalValue, createScene]);

  // useEffect(() => {
  //   // if a venue is changed, it'll add the new lights to it..
  //   scenes.forEach((scene) => {
  //     const fixtureGroups = scene.fixtureGroups.reduce(
  //       (fixtureGroups, group) => {

  //         return [
  //           ...fixtureGroups,
  //           group.filter((fId) =>
  //             venue?.venueFixtures.find((fix) => fix.id !== fId)
  //           ),
  //         ];
  //       },
  //       [] as string[][]
  //     ).filter(a => a.length !== 0)

  //     console.log('fixtureGroups', fixtureGroups)

  //     venue?.venueFixtures.forEach((f) => {
  //       const found = fixtureGroups.find((fIds) => fIds.includes(f.id));
  //       if (!found) {
  //         fixtureGroups.push([f.id]);
  //       }
  //     });
  //     updateScene({
  //       ...scene,
  //       fixtureGroups,
  //     });
  //   });
  // }, [activeScenes, venue?.venueFixtures]);

  const updateScene = (scene: Scene) => {
    setScenes((state) => {
      const index = state.findIndex((v) => v.id === scene.id);
      if (index > -1) {
        state[index] = scene;
        return [...state];
      } else {
        return [...state, scene];
      }
    });
  };

  const saveScene = async (scene: Scene) => {
    console.log("SAVING", scene);
    const database = await getDatabase();

    database.put("scenes", scene);
  };

  return (
    <SceneContext.Provider
      value={{
        createScene,
        saveScene,
        scenes,
        updateScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};
