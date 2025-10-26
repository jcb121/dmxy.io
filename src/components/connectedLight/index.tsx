import { useCallback, useEffect, useMemo, useRef } from "react";
import { ChannelSimpleFunction, Fixture } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { New_GenericProfile, ProfileState } from "../../context/profiles";
import {
  animateRGB,
  mapProfileStateToDMX,
  setCSSVarsFromDmx,
} from "../../utils";
import { DMXState } from "../../dmx";
import { VenueFixture } from "../../context/venues";
import { Scene } from "../../context/scenes";

const RGB = [
  ChannelSimpleFunction.red,
  ChannelSimpleFunction.green,
  ChannelSimpleFunction.blue,
];

export const ConnectedLight = ({
  fixture,
  channel,
  children,
  venueFixture,
  scene,
}: {
  children?: React.ReactNode;
  channel?: number;
  fixture: Fixture;
  venueFixture: VenueFixture;
  scene?: Scene;
}) => {
  const globals = useGlobals((state) => state.values);

  const hold = parseInt(
    `${
      typeof scene?.vars?.["Beatlength"]?.value !== "undefined"
        ? scene?.vars?.["Beatlength"]?.value
        : globals["Beatlength"]?.value || 0
    }`
  );
  const fade = parseInt(
    `${
      typeof scene?.vars?.["Fade"]?.value !== "undefined"
        ? scene?.vars?.["Fade"]?.value
        : globals["Fade"]?.value || 0
    }`
  );
  const fadeGap = parseInt(
    `${
      typeof scene?.vars?.["FadeGap"]?.value !== "undefined"
        ? scene?.vars?.["FadeGap"]?.value
        : globals["FadeGap"]?.value || 0
    }`
  );

  const ref = useRef<HTMLDivElement>(null);

  const profiles = useMemo<New_GenericProfile[]>(() => {
    if (!scene || !scene?.new_profiles) return [];

    const id = `#${venueFixture.id}`;

    if (scene?.new_profiles[id]) {
      return scene.new_profiles[id];
    }

    const profile = venueFixture.tags.find(
      (tag) => scene.new_profiles[`.${tag}`]
    );

    if (scene.new_profiles[`.${profile}`]) {
      return scene.new_profiles[`.${profile}`];
    }

    if (scene.new_profiles["*"]) {
      return scene.new_profiles["*"];
    }

    return [];
  }, [scene, venueFixture]);

  const activeProfile = useCallback(
    (timeStamp: number): New_GenericProfile | undefined => {
      if (!profiles || profiles.length === 0) return; // we have no profiles, but is this correct?
      const stepDuration = hold; // 1000
      const step = (timeStamp / stepDuration) % profiles.length;
      const frameIndex = Math.floor(step);

      return profiles[frameIndex];
    },
    [hold, profiles]
  );

  const animationRef = useRef<number>();

  const animateRGBFade = useCallback(
    (timeStamp: number) => {
      if (!profiles || profiles.length === 0) return;

      const stepDuration = hold; // 1000

      const gapTime = (stepDuration / 255) * fadeGap;
      const onTime = stepDuration - gapTime;
      const fadeTime = (onTime / 510) * fade; // 250
      const normalTime = stepDuration - gapTime - fadeTime - fadeTime;

      let currentColour: [number, number, number] | undefined = undefined;

      if (stepDuration) {
        const step = (timeStamp / stepDuration) % profiles.length;
        const frameIndex = Math.floor(step);

        const stepTime = (step - frameIndex) * stepDuration;

        if (stepTime < fadeTime) {
          const lastProfile =
            profiles[frameIndex - 1] || profiles[profiles.length - 1];

          currentColour = animateRGB(
            fadeGap
              ? [0, 0, 0]
              : [
                  lastProfile.state.Red || 0,
                  lastProfile.state.Green || 0,
                  lastProfile.state.Blue || 0,
                ],
            [
              profiles[frameIndex].state.Red || 0,
              profiles[frameIndex].state.Green || 0,
              profiles[frameIndex].state.Blue || 0,
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
              profiles[frameIndex].state.Red || 0,
              profiles[frameIndex].state.Green || 0,
              profiles[frameIndex].state.Blue || 0,
            ],
            fadeGap
              ? [0, 0, 0]
              : [
                  nextProfile.state.Red || 0,
                  nextProfile.state.Green || 0,
                  nextProfile.state.Blue || 0,
                ],
            fadeGap ? fadeTime : fadeTime * 2,
            fadeGap
              ? stepTime - fadeTime - normalTime
              : stepTime - normalTime - fadeTime
          );
        } else {
          // console.log("normal");
        }
      }

      return currentColour;
    },
    [hold, fadeGap, fade, profiles]
  );

  const isRGB = RGB.every((func) => {
    return fixture.channelFunctions.find((channel) => {
      return channel.find((f) => f.function === func);
    });
  });

  const animate = useCallback(
    (timeStamp: number) => {
      const profile = activeProfile(timeStamp);

      // if it is not RGB, this will set the colours to zero, and this will mess with the solid colours.
      const targetColour = (isRGB && animateRGBFade(timeStamp)) || undefined;

      const state = Object.keys(venueFixture.overwrites).reduce(
        (state, key) => ({
          ...state,
          [key]:
            globals[venueFixture.overwrites[key as ChannelSimpleFunction]]
              .value,
        }),
        {
          ...profile?.state,
          ...(targetColour && {
            Red: targetColour[0],
            Green: targetColour[1],
            Blue: targetColour[2],
          }),
        } satisfies Partial<ProfileState>
      );

      const dmxVals = mapProfileStateToDMX(
        fixture.channelFunctions,
        state,
        profile?.targetFunction,
        fixture.deviceFunctions
      );

      if (ref.current) setCSSVarsFromDmx(ref.current, fixture, dmxVals);

      if (typeof channel !== "undefined") {
        Object.keys(dmxVals).forEach((key) => {
          DMXState[parseInt(key) + channel] = dmxVals[parseInt(key)];
        });
      }
    },
    [
      fixture,
      globals,
      channel,
      animateRGBFade,
      isRGB,
      activeProfile,
      venueFixture,
    ]
  );

  useEffect(() => {
    if (hold) {
      animationRef.current && clearInterval(animationRef.current);
      animationRef.current = setInterval(
        () => animate(performance.now()),
        // 46
        23 // more like 60fps
        // 1000
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
      {children}
      {/* <Light fixture={fixture} /> */}
    </div>
  );
};
