import { DMXState } from "../../context/dmx";
import { ChannelSimpleFunction, useFixtures } from "../../context/fixtures";
import {
  GlobalTypes,
  NewGlobalValues,
  NewGlobalsValue,
} from "../../context/globals";
import { New_GenericProfile, ProfileState } from "../../context/profiles";
import { Scene } from "../../context/scenes";
import { VenueFixture } from "../../context/venues";
import { animateRGBFade } from "./animateRBGFade";
import { frameToDmx } from "./frameToDmx";
import { getActiveRule } from "./rules";

const RGB = [
  ChannelSimpleFunction.red,
  ChannelSimpleFunction.green,
  ChannelSimpleFunction.blue,
];

export const sceneToDmx = ({
  scene,
  venueFixtures,
  globals,
  timeStamp,
}: {
  scene: Scene;
  venueFixtures: VenueFixture[];
  globals: NewGlobalValues<NewGlobalsValue>;
  timeStamp: number;
}) => {
  // clear the DMX state
  Object.keys(DMXState).forEach((universe) => {
    DMXState[parseInt(universe)].fill(0);
  });

  const hold = parseInt(
    `${
      typeof scene?.vars?.["Beatlength"]?.value !== "undefined"
        ? scene?.vars?.["Beatlength"]?.value
        : globals["Beatlength"]?.value || 1000
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

  venueFixtures.forEach((venueFixture) => {
    const fixture = useFixtures
      .getState()
      .fixtures.find((f) => f.id === venueFixture.fixtureId);

    if (!fixture) return;

    const isRGB = RGB.every((func) => {
      return fixture.channelFunctions.find((channel) => {
        return channel.find((f) => f.function === func);
      });
    });

    const profiles: New_GenericProfile[] = (() => {
      if (!scene || !scene?.new_profiles) return [];
      return getActiveRule(scene, venueFixture);
    })();

    if (!profiles || profiles.length === 0) return; // we have no profiles, but is this correct?
    const stepDuration = hold; // 1000
    const step = (timeStamp / stepDuration) % profiles.length;
    const frameIndex = Math.floor(step);

    const profile = profiles[frameIndex];

    const targetColour =
      (isRGB &&
        animateRGBFade(timeStamp, profiles, stepDuration, fade, fadeGap)) ||
      undefined;

    const overwrites = venueFixture.overwrites;

    const state = Object.keys(overwrites).reduce(
      (state, key) => {
        const overwrite = overwrites[key as keyof typeof overwrites];
        if (typeof overwrite !== "undefined" && globals[overwrite].value)
          return {
            ...state,
            [key]: globals[overwrite].value,
          };

        return state;
      },
      {
        ...profile?.state,
        ...(targetColour && {
          Red: targetColour[0],
          Green: targetColour[1],
          Blue: targetColour[2],
        }),
      } satisfies Partial<ProfileState>
    );

    // Track min/max globals
    for (const key in state) {
      const maxGlobal = globals[`MAX_${key}`];
      const minGlobal = globals[`MIN_${key}`];
      const vaue = state[key as keyof typeof state];

      if (
        maxGlobal &&
        typeof vaue !== "undefined" &&
        maxGlobal.type === GlobalTypes.byte &&
        maxGlobal.value < vaue
      ) {
        state[key as keyof typeof state] = maxGlobal.value;
      }

      if (
        minGlobal &&
        typeof vaue !== "undefined" &&
        minGlobal.type === GlobalTypes.byte &&
        minGlobal.value > vaue
      ) {
        state[key as keyof typeof state] = minGlobal.value;
      }
    }

    const dmxVals = frameToDmx(
      fixture.channelFunctions,
      state,
      profile?.targetFunction,
      fixture.deviceFunctions
    );

    if (typeof venueFixture.channel !== "undefined") {
      Object.keys(dmxVals).forEach((key) => {
        DMXState[venueFixture.universe || 0][
          parseInt(key) + venueFixture.channel
        ] = dmxVals[parseInt(key)];
      });
    }
  });
};
