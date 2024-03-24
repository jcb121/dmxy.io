import React, { useEffect, useState } from "react";
import { getDatabase } from "../db";

export type Scene = {
  profiles: Record<string, string>;
  fixtureGroups: string[][];
  id: string;
  name: string;
};

const SAMPLE_SCENE = {
  fixtureGroups: [],
  id: crypto.randomUUID(),
  profiles: {},
  name: "Red Scene",
};

export const SceneContext = React.createContext<{
  scenes: Scene[];
  updateScene: (s: Scene) => void;
  saveScene: (s: Scene) => void;
}>({
  scenes: [SAMPLE_SCENE],
  updateScene: () => {},
  saveScene: () => {},
});

export const SceneProvider = ({ children }: { children: React.ReactNode }) => {
  const [scenes, setScenes] = useState<Scene[]>([SAMPLE_SCENE]);

  useEffect(() => {
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("scenes");
      console.log("GOT SCENES", data)

      if (data.length > 0) setScenes(data);
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
        saveScene,
        scenes,
        updateScene,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};
