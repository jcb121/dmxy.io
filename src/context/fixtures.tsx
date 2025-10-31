import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DMXValues = Record<number, number>; // 0: 0 -> 255

export type FixtureProfile = {
  fixtureId: string;
  id: string;
  name: string;
  dmxValues: DMXValues;
};

export enum ChannelSimpleFunction {
  unknown = "",
  colour = "Colour",
  fixedColour = "Fixed Colour",
  uv = "UV",
  amber = "Amber",
  red = "Red",
  white = "White",
  green = "Green",
  blue = "Blue",
  intensity = "Intensity",
  strobe = "Strobe",

  function = "Function", // do I want to keep this here....
  functions = "Functions",

  speed = "Speed",
  // sound = "Sound", // sound is a mode

  //
  goboWheel = "Gobo Wheel",
  goboRotation = "Gobo Rotation",
  pan = "Pan",
  tilt = "Tilt",
  colourWheel = "Colour Wheel",
  prism = "Prism",
  reset = "Reset",
}

export enum ColourMode {
  rgbw = "rgbw",
  rgb = "rgb",
  fixed = "fixed",
  single = "single",
}

export interface SubChannelFunction<
  T = ChannelSimpleFunction,
  low = number,
  high = number
> {
  range: [low, high];
  function: T;
  value?: string; // can be a HTML color code
  mapIntensity?: boolean;
}

export type ChannelFunction = SubChannelFunction<ChannelSimpleFunction>[];

export type ChannelFunctions = ChannelFunction[];

export enum FixtureShape {
  circle = "Circle",
  square = "Square",
  bar = "Bar",
}

export type FixtureFunction = {
  id: string;
  label: string;
  values: Record<string, number>;
};

export enum SupportedFixtures {
  light = "Light",
  smokeMachine = "smokeMachine",
}

export type Fixture = {
  type: SupportedFixtures;
  id: string;
  model: string;
  channelFunctions: ChannelFunctions; // index is bad here now..
  deviceFunctions?: FixtureFunction[];
  fixtureShape: FixtureShape;
};

export const useFixtures = create<{
  fixtures: Fixture[];
  add: (f: Fixture) => void;
  update: (f: Fixture) => void;
  remove: (f: Fixture) => void;
}>()(
  persist(
    (set) => {
      return {
        fixtures: [],
        add: (fixture) => {
          set((state) => ({
            ...state,
            fixtures: [...state.fixtures, fixture],
          }));
        },
        update: (fixture) => {
          set((state) => ({
            ...state,
            fixtures: state.fixtures.map((f) =>
              f.id === fixture.id ? fixture : f
            ),
          }));
        },
        remove: (fixture) => {
          set((state) => ({
            ...state,
            fixtures: state.fixtures.filter((f) => f.id !== fixture.id),
          }));
        },
      };
    },
    {
      name: "fixtures",
    }
  )
);

window.addEventListener("storage", (e: StorageEvent) => {
  if (e.key === useFixtures.persist.getOptions().name && e.newValue) {
    useFixtures.persist.rehydrate();
  }
});

export const FixtureContext = React.createContext<{
  fixtures: Fixture[];
  fixtureProfiles: FixtureProfile[];
  saveFixture: (f: Fixture) => void;
  saveFixtureProfile: (f: FixtureProfile) => void;
}>({
  fixtures: [],
  fixtureProfiles: [],
  saveFixture: () => {},
  saveFixtureProfile: () => {},
});
