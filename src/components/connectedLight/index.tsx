import { useCallback, useEffect, useRef } from "react";
import { ChannelSimpleFunction, Fixture } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { GenericProfile, ProfileState } from "../../context/profiles";
import {
  animateRGB,
  mapProfileStateToDMX,
  setCSSVarsFromDmx,
} from "../../utils";
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
  const fade = parseInt(`${globals["Fade"]?.value || 0}`);
  const fadeGap = parseInt(`${globals["FadeGap"]?.value || 0}`);
  const ref = useRef<HTMLDivElement>(null);

  // const state =
  //   profiles &&
  //   profiles[0] &&
  //   Object.keys(profiles[0].globals).reduce((state, key) => {
  //     return profiles[0].globals[key as ChannelSimpleFunction]
  //       ? { ...state, [key]: globals[key].value }
  //       : state;
  //   }, profiles[0].state);

  // const [dmxVals, setDmxVals] = useState<DMXValues>(
  //   profiles && profiles[0] && state
  //     ? mapRGBASToDMX(
  //         fixture.channelFunctions,
  //         `${state.Red.toString(16).padStart(2, "0")}${state.Green.toString(
  //           16
  //         ).padStart(2, "0")}${state.Blue.toString(16).padStart(2, "0")}`,
  //         state.Brightness,
  //         state.Strobe
  //       )
  //     : {}
  // );

  const animationRef = useRef<number>();

  const animate = useCallback(
    (timeStamp: number) => {
      if (!profiles || profiles.length === 0) return;

      const stepDuration = hold; // 1000

      const gapTime = (stepDuration / 255) * fadeGap;

      const onTime = stepDuration - gapTime;

      const fadeTime = (onTime / 510) * fade; // 250

      const normalTime = stepDuration - gapTime - fadeTime - fadeTime;

      if (stepDuration) {
        const step = (timeStamp / stepDuration) % profiles.length;
        const frameIndex = Math.floor(step);

        const stepTime = (step - frameIndex) * stepDuration;

        let currentColour: [number, number, number] | undefined = undefined;

        if (stepTime < fadeTime) {
          const lastProfile =
            profiles[frameIndex - 1] || profiles[profiles.length - 1];

          currentColour = animateRGB(
            fadeGap
              ? [0, 0, 0]
              : [
                  lastProfile.state.Red,
                  lastProfile.state.Green,
                  lastProfile.state.Blue,
                ],
            [
              profiles[frameIndex].state.Red,
              profiles[frameIndex].state.Green,
              profiles[frameIndex].state.Blue,
            ],
            fadeGap ? fadeTime : fadeTime * 2,
            fadeGap ? stepTime : stepTime + fadeTime
          );
        } else if (stepTime > stepDuration - gapTime) {
          // in the gap, the colour is black
          currentColour = [0, 0, 0];
        } else if (stepTime > normalTime + fadeTime) {
          const nextProfile = profiles[frameIndex + 1] || profiles[0];

          currentColour = animateRGB(
            [
              profiles[frameIndex].state.Red,
              profiles[frameIndex].state.Green,
              profiles[frameIndex].state.Blue,
            ],
            fadeGap
              ? [0, 0, 0]
              : [
                  nextProfile.state.Red,
                  nextProfile.state.Green,
                  nextProfile.state.Blue,
                ],
            fadeGap ? fadeTime : fadeTime * 2,
            fadeGap
              ? stepTime - fadeTime - normalTime
              : stepTime - normalTime - fadeTime
          );
        } else {
          // console.log("normal");
        }

        const state = Object.keys(profiles[frameIndex].globals).reduce(
          (state, key) => {
            const globalName =
              profiles[frameIndex].globals[key as ChannelSimpleFunction];

            return profiles[frameIndex].globals[key as ChannelSimpleFunction]
              ? { ...state, [key]: globals[globalName]?.value }
              : state;
          },
          {
            ...profiles[frameIndex].state,
            ...(currentColour
              ? {
                  Red: currentColour[0],
                  Green: currentColour[1],
                  Blue: currentColour[2],
                }
              : {}),
          } as ProfileState
        );

        const dmxVals = mapProfileStateToDMX(fixture.channelFunctions, state);

        if (ref.current) setCSSVarsFromDmx(ref.current, fixture, dmxVals);

        if (typeof channel !== "undefined") {
          Object.keys(dmxVals).forEach((key) => {
            DMXState[parseInt(key) + channel] = dmxVals[parseInt(key)];
          });
        }
      }
    },
    [hold, profiles, fixture, globals, channel, fade, fadeGap]
  );

  useEffect(() => {
    if (hold) {
      animationRef.current && clearInterval(animationRef.current);
      animationRef.current = setInterval(
        () => animate(performance.now()),
        // 46
        23 // more like 60fps
      );
    } else {
      animate(performance.now());
    }
    return () => {
      animationRef.current && clearInterval(animationRef.current);
    };
  }, [animate, hold]);

  return (
    <div ref={ref}>
      <Light fixture={fixture} />
    </div>
  );
};
