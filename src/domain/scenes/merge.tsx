import { Scene } from "../../context/scenes";

export const mergeScenes = (
  scene1: Scene,
  scene2: Scene,
  joinAt?: string,
): Scene => {
  const newProfiles = Object.keys(scene2.new_profiles).reduce(
    (acc, selector) => {
      if (!joinAt) {
        return {
          [selector]: scene2.new_profiles[selector],

          ...acc,
        };
      }
      let newSelector = "";
      // if the scene being merged targets all, it should target at the join;
      // if selector and join are the same, keep it the same
      if (selector === "*" || selector === joinAt) {
        newSelector = joinAt;
      } else {
        // compound the selector
        newSelector = `${joinAt} ${selector}`;
      }

      return {
        [newSelector]: scene2.new_profiles[selector],
        ...acc,
      };
    },
    {} as Scene["new_profiles"],
  );

  return {
    ...scene1,
    new_profiles: {
      ...scene1.new_profiles,
      ...newProfiles,
    },
  };
};
