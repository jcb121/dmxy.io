import React, { useEffect, useState } from "react";
import { getDatabase } from "../db";
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
  unknow = "",
  colour = "Colour",
  fixedColour = "Fixed Colour",
  red = "Red",
  white = "White",
  green = "Green",
  blue = "Blue",
  intensity = "Intensity",
  strobe = "Strobe",
  function = "Function",
  speed = "Speed",
  sound = "Sound",

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
}

export type ChannelFunction = SubChannelFunction<ChannelSimpleFunction>[];

export type ChannelFunctions = ChannelFunction[];

export enum FixtureShape {
  circle = "Circle",
  square = "Square",
  bar = "Bar",
}

export type Fixture = {
  id: string;
  model: string;
  // channels: number;
  channelFunctions: ChannelFunctions;
  fixtureShape: FixtureShape;
  // colourMode: ColourMode;
  // colour?: string;
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
            fixtures: state.fixtures.filter((f) => f.id === fixture.id),
          }));
        },
      };
    },
    {
      name: "fixtures",
    }
  )
);

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

export const FixtureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    (async () => {
      const database = await getDatabase();

      database?.getAll("fixtures").then((res) => {
        setFixtures(res);
      });
      database?.getAll("fixtureProfiles").then((res) => {
        setFixtureProfiles(res);
      });
    })();
  }, []);

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixtureProfiles, setFixtureProfiles] = useState<FixtureProfile[]>([]);

  const saveFixture = async (f: Fixture) => {
    const database = await getDatabase();

    database.add("fixtures", f);

    setFixtures((state) => [...state, f]);
  };

  const saveFixtureProfile = async (p: FixtureProfile) => {
    const database = await getDatabase();

    database.add("fixtureProfiles", p);

    setFixtureProfiles((state) => [...state, p]);
  };

  return (
    <FixtureContext.Provider
      value={{
        fixtures,
        fixtureProfiles,
        saveFixture,
        saveFixtureProfile,
      }}
    >
      {children}
    </FixtureContext.Provider>
  );
};
