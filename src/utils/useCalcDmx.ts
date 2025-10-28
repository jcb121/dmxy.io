import { useRef, useCallback, useEffect } from "react";
import { Scene } from "../context/scenes";
import { sceneToDmx } from "./sceneToDmx";
import { VenueFixture } from "../context/venues";
import { useGlobals } from "../context/globals";

/**
 * This hook create the DMX state in all universes
 */
export const useCalcDmx = (
  scene: Scene | undefined,
  venueFixtures: VenueFixture[] | undefined
) => {
  const animationRef = useRef<NodeJS.Timeout>();

  const globals = useGlobals((state) => state.values);

  const animate = useCallback(
    (timeStamp: number) => {
      if (!scene || !venueFixtures) return;

      sceneToDmx({
        scene,
        venueFixtures,
        globals,
        timeStamp,
      });
    },
    [scene, globals, venueFixtures]
  );

  useEffect(() => {
    animationRef.current && clearInterval(animationRef.current);
    animationRef.current = setInterval(
      () => animate(performance.now()),
      16
    );

    return () => {
      animationRef.current && clearInterval(animationRef.current);
    };
  }, [animate]);
};
