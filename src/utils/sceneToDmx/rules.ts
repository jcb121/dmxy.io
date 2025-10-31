import { New_GenericProfile } from "../../context/profiles";
import { Scene } from "../../context/scenes";
import { VenueFixture } from "../../context/venues";

/**
 *
 * @param scene
 * @param venueFixture
 * @returns null if there are no matching rules
 */
export const getMatchingRules = (
  scene: Scene,
  venueFixture: VenueFixture
): Record<string, New_GenericProfile[]> | null => {
  const emptyObject = {};

  const res = Object.keys(scene.new_profiles).reduce(
    (profiles, activeSelector) => {
      const selectors = activeSelector.split(" ");

      const res = selectors.every((activeSelector) => {
        if (activeSelector[0] === "@") {
          const id = activeSelector.slice(1);
          return venueFixture.fixtureId === id;
        }
        if (activeSelector[0] === "#") {
          const id = activeSelector.slice(1);
          return venueFixture.id === id;
        }
        if (activeSelector[0] === ".") {
          const tag = activeSelector.slice(1);
          return venueFixture.tags.includes(tag);
        }

        return activeSelector === "*";
      });

      if (res) {
        return {
          ...profiles,
          [activeSelector]: scene.new_profiles[activeSelector],
        };
      }

      return profiles;
    },
    emptyObject as Record<string, New_GenericProfile[]>
  );

  return res === emptyObject ? null : res;
};

export const getRuleRank = (
  matchingRules: Record<string, New_GenericProfile[]>
): Record<string, number> =>
  Object.keys(matchingRules).reduce((ranks, rule) => {
    let rank = 0;
    const parts = rule.split(" ");
    parts.forEach((part) => {
      // * is 0;
      if (part.includes(".")) rank += 1;
      if (part.includes("@")) rank += 10;
      if (part.includes("#")) rank += 100;
    });
    return {
      ...ranks,
      [rule]: rank,
    };
  }, {} as Record<string, number>);

export const getHighestRule = (ruleRank: Record<string, number>): string =>
  Object.keys(ruleRank).reduce((highValRule, rule) => {
    if (ruleRank[highValRule] < ruleRank[rule]) {
      return rule;
    }
    return highValRule;
  });

export const getActiveRule = (
  scene: Scene,
  venueFixture: VenueFixture
): New_GenericProfile[] => {
  const matchingRules = getMatchingRules(scene, venueFixture);
  if (!matchingRules) return [];
  const ruleRank = getRuleRank(matchingRules);
  const finalRule = getHighestRule(ruleRank);
  return matchingRules[finalRule];
};
