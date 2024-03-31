import React, { useCallback, useContext, useEffect, useState } from "react";
import { getDatabase } from "../db";
import { Venue, VenueContext } from "./venues";

export type Scene = {
  // group can have multi profiles
  //  0 (left beflow): [prof1ID, prod2ID]
  profiles: Record<number, string[]>;

  // array of the groups
  // [ [ left ]  [mid]  [right]]
  fixtureGroups: string[][];
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
  activeScene?: string;
  setActiveScene: (a: string) => void;
  scenes: Scene[];
  updateScene: (s: Scene) => void;
  saveScene: (s: Scene) => void;
  createScene: () => void;
}>({
  scenes: [],
  setActiveScene: () => {},
  updateScene: () => {},
  saveScene: () => {},
  createScene: () => {},
});

export const SceneProvider = ({ children }: { children: React.ReactNode }) => {
  const { venues } = useContext(VenueContext);
  const venue = venues[0] as Venue | undefined;
  const [activeScene, setActiveScene] = useState<string>();

  const [scenes, setScenes] = useState<Scene[]>([]);

  const createScene = useCallback(() => {
    if (!venue) return;
    const sampleScene = SAMPLE_SCENE();

    const newScene = {
      ...sampleScene,
      fixtureGroups: venue.venueFixtures.map((f) => [f.id]),
      profiles: venue.venueFixtures.reduce((profiles, _, index) => {
        profiles[index] = [];
        return profiles;
      }, {} as Record<number, string[]>),
    };

    setScenes((state) => [...state, newScene]);
    setActiveScene(sampleScene.id);
  }, [venue]);

  useEffect(() => {
    if (scenes.length === 0 && venue?.venueFixtures) {
      createScene();
    }
  }, [createScene, scenes, venue]);

  useEffect(() => {
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("scenes");
      console.log("GOT SCENES", data);

      if (data.length > 0) {
        setScenes(data);
        setActiveScene(data[0].id);
      }
    })();
  }, []);

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
        activeScene,
        setActiveScene: (sceneId) => setActiveScene(sceneId),
        saveScene,
        scenes,
        updateScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};
