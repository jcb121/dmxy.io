import { useRef, useCallback, useEffect } from "react";
import { Scene } from "../context/scenes";
import { sceneToDmx } from "./sceneToDmx";
import { VenueFixture } from "../context/venues";
import { useGlobals } from "../context/globals";

/**
 * This hook create the DMX state in a single
 */
export const useCalcDmx = (
  scene: Scene | undefined,
  venueFixtures: VenueFixture[] | undefined
) => {
  const animationRef = useRef<number>();

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
      // 46
      23 // more like 60fps
      // 1000
    );

    return () => {
      animationRef.current && clearInterval(animationRef.current);
    };
  }, [animate]);
};
