import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChannelSimpleFunction,
  DMXValues,
  Fixture,
} from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { GenericProfile } from "../../context/profiles";
import { mapRGBASToDMX } from "../../utils";
import { Light } from "../light";
import { DMXState } from "../../dmx";

export const ConnectedLight = ({
  fixture,
  profiles,
  channel,
}: {
  channel?: number;
  fixture: Fixture;
  profiles?: Omit<GenericProfile, "id">[];
}) => {
  const globals = useGlobals((state) => state.values);

  const hold = parseInt(`${globals["Beatlength"]?.value || 0}`);

  const state =
    profiles &&
    profiles[0] &&
    Object.keys(profiles[0].globals).reduce((state, key) => {
      return profiles[0].globals[key as ChannelSimpleFunction]
        ? { ...state, [key]: globals[key].value }
        : state;
    }, profiles[0].state);

  const [dmxVals, setDmxVals] = useState<DMXValues>(
    profiles && profiles[0] && state
      ? mapRGBASToDMX(
          fixture.channelFunctions,
          `${state.Red.toString(16).padStart(2, "0")}${state.Green.toString(
            16
          ).padStart(2, "0")}${state.Blue.toString(16).padStart(2, "0")}`,
          state.Brightness,
          state.Strobe
        )
      : {}
  );

  const animationRef = useRef<number>();

  const animate = useCallback(
    (timeStamp: number) => {
      if (!profiles || profiles.length === 0) return;

      const stepDuration = hold;
      // (profile.hold || 0) + (profile?.fadeIn || 0) + (profile.fadeOut || 0);

      if (stepDuration) {
        const step = (timeStamp / stepDuration) % profiles.length;
        const frameIndex = Math.floor(step);

        // console.log(step, frameIndex)

        // console.log('fr',frameIndex);

        // const stepTime = (step - frameIndex) * stepDuration;
        // const profile = profiles[frameIndex];
        // const nextProfile = profiles[frameIndex + 1] || profiles[0];

        // if (profile.fadeIn && stepTime < (profile.fadeIn || 0)) {
        //   const colour = animateColour(
        //     nextFrame.value.Colour,
        //     frame.value.Colour,
        //     profile.fadeIn,
        //     stepTime
        //   );

        //   setDmxVals(
        //     mapRGBASToDMX(
        //       fixture.channelFunctions,
        //       colour,
        //       profile.states[frameIndex].state.Brightness,
        //       profile.states[frameIndex].state.Strobe
        //     )
        //   );
        // } else if (
        //   profile.fadeOut &&
        //   stepTime > stepDuration - (profile.fadeOut || 0)
        // ) {
        // const colour = animateColour(
        //   frame.value.Colour,
        //   nextFrame.value.Colour,
        //   profile.fadeOut,
        //   stepTime
        // );

        // mapRGBASToDMX(
        //   fixture.channelFunctions,
        //   colour,
        //   profile.states[frameIndex].state.Brightness,
        //   profile.states[frameIndex].state.Strobe
        // );
        // } else {

        const state = Object.keys(profiles[frameIndex].globals).reduce(
          (state, key) => {
            return profiles[frameIndex].globals[key as ChannelSimpleFunction]
              ? { ...state, [key]: globals[key].value }
              : state;
          },
          profiles[frameIndex].state
        );

        // console.log(state);

        const dmxVals = mapRGBASToDMX(
          fixture.channelFunctions,
          `${state.Red.toString(16).padStart(2, "0")}${state.Green.toString(
            16
          ).padStart(2, "0")}${state.Blue.toString(16).padStart(2, "0")}`,
          state.Brightness,
          state.Strobe
        );

        // USE CSS VALUES HERE AS THEY CAN BE NESTED. THIS WILL SAVE IT FROM REACT SHIT..
        setDmxVals(dmxVals);

        if (typeof channel === "undefined") return;

        Object.keys(dmxVals).forEach((key) => {
          DMXState[parseInt(key) + channel] = dmxVals[parseInt(key)];
        });
      }
    },
    [hold, profiles, fixture.channelFunctions, globals, channel, setDmxVals]
  );

  useEffect(() => {
    if (hold) {
      animationRef.current && clearInterval(animationRef.current);
      animationRef.current = setInterval(() => animate(performance.now()), 46);
    }
  }, [animate, hold]);

  return <Light fixture={fixture} dmxValues={dmxVals} />;
};
