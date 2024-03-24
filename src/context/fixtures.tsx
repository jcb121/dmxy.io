import React, { useEffect, useState } from "react";
import { getDatabase } from "../db";

export type DMXValues = Record<number, number>; // 0: 0 -> 255

export type FixtureProfile = {
  fixtureId: string;
  id: string;
  name: string;
  dmxValues: DMXValues;
};

export enum ChannelSimpleFunction {
  unknow = "",
  // colour = "Colour",


  red = "Red",
  green = "Green",
  blue = "Blue",
  white = "White",
  brightness = "Brightness",
  strobe = "Strobe",
  function = "Function",
  speed = "Speed",
  sound = "Sound",

  // on = "On",
  // multi = "Multi"
}

// export const visibleColours = {

// }


export const visibleChannelFunctions = [
  ChannelSimpleFunction.red,
  ChannelSimpleFunction.blue,
  ChannelSimpleFunction.brightness,
  ChannelSimpleFunction.green,
  ChannelSimpleFunction.strobe,
  ChannelSimpleFunction.white,
];

export interface SubChannelFunction<
  T = ChannelSimpleFunction,
  low = number,
  high = number
> {
  range: [low, high];
  function: T;
}

export type ChannelFunction = Record<
  number,
  SubChannelFunction<ChannelSimpleFunction>
>;

export type ChannelFunctions = Record<number, ChannelFunction>;

export enum FixtureShape {
  circle = "Circle",
}

export type Fixture = {
  id: string;
  model: string;
  channels: number;
  channelFunctions: ChannelFunctions;
  fixtureShape: FixtureShape;
};

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
