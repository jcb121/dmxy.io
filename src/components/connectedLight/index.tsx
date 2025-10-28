import { useCallback, useEffect, useRef } from "react";
import { Fixture } from "../../context/fixtures";
import { setCSSVarsFromDmx } from "../../utils";
import { VenueFixture } from "../../context/venues";
import { DMXState } from "../../context/dmx";
/**
 * This react component uses the global DMX State and maps it to CSS Variables for the children to use.
 */
export const ConnectedLight = ({
  fixture,
  children,
  venueFixture,
}: {
  fixture: Fixture;
  children?: React.ReactNode;
  venueFixture: VenueFixture;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const animationRef = useRef<NodeJS.Timeout>();

  const animate = useCallback(() => {
    if (ref.current)
      setCSSVarsFromDmx(
        ref.current,
        fixture,
        DMXState[venueFixture.universe || 0],
        venueFixture.channel
      );
  }, [venueFixture, fixture]);

  useEffect(() => {
    animationRef.current && clearInterval(animationRef.current);
    animationRef.current = setInterval(
      () => animate(),
      // 46
      23 // more like 60fps
      // 1000
    );

    return () => {
      animationRef.current && clearInterval(animationRef.current);
    };
  }, [animate]);

  return <div ref={ref}>{children}</div>;
};
