import { useCallback, useEffect, useRef, useState } from "react";
import { DMXValues, Fixture } from "../../context/fixtures";
import { GenericProfile } from "../../context/profiles";
import { Light } from "../light";
import { animateColour, mapRGBASToDMX } from "../../utils";

export const ConnectedLight = ({
  fixture,
  profile,
}: {
  fixture: Fixture;
  profile?: Omit<GenericProfile, "id">;
}) => {
  const [dmxVals, setDmxVals] = useState<DMXValues>(
    mapRGBASToDMX(
      fixture.channelFunctions,
      profile?.states[0].value.Colour || "000000",
      profile?.states[0].state.Brightness || 0,
      profile?.states[0].state.Strobe || 0
    )
  );

  const animate = useCallback(
    (timeStamp: number) => {
      if (!profile) return;

      const stepDuration =
        (profile.hold || 0) + (profile?.fadeIn || 0) + (profile.fadeOut || 0);

      if (stepDuration) {
        const step = (timeStamp / stepDuration) % profile.states.length;
        const frameIndex = Math.floor(step);
        const stepTime = (step - frameIndex) * stepDuration;
        const frame = profile.states[frameIndex];
        const nextFrame = profile.states[frameIndex + 1] || profile.states[0];

        if (profile.fadeIn && stepTime < (profile.fadeIn || 0)) {
          const colour = animateColour(
            nextFrame.value.Colour,
            frame.value.Colour,
            profile.fadeIn,
            stepTime
          );

          setDmxVals(
            mapRGBASToDMX(
              fixture.channelFunctions,
              colour,
              profile.states[frameIndex].state.Brightness,
              profile.states[frameIndex].state.Strobe
            )
          );
        } else if (
          profile.fadeOut &&
          stepTime > stepDuration - (profile.fadeOut || 0)
        ) {
          const colour = animateColour(
            frame.value.Colour,
            nextFrame.value.Colour,
            profile.fadeOut,
            stepTime
          );

          mapRGBASToDMX(
            fixture.channelFunctions,
            colour,
            profile.states[frameIndex].state.Brightness,
            profile.states[frameIndex].state.Strobe
          );
        } else {
          setDmxVals(
            mapRGBASToDMX(
              fixture.channelFunctions,
              profile.states[frameIndex].value.Colour,
              profile.states[frameIndex].state.Brightness,
              profile.states[frameIndex].state.Strobe
            )
          );
        }
      }
      requestAnimationFrame(animate);
    },
    [profile, fixture]
  );

  const animationRef = useRef<number>();

  useEffect(() => {
    animationRef.current && cancelAnimationFrame(animationRef.current);
    if (profile?.hold) animationRef.current = requestAnimationFrame(animate);
  }, [profile, animate]);

  return <Light fixture={fixture} dmxValues={dmxVals} />;
};
