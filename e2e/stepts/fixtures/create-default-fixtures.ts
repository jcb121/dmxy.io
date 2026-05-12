import { Page } from "@playwright/test";
import { createFixture } from "../create-fixture";

export type TestingFixture = {
  name: string;
  shape: "Circle" | "Bar";
  functions: {
    channel: string;
    value: number;
    name: string;
  }[];
  channels: { type: string; color?: string; mapIntensity?: boolean }[];
};

export const RBG_3CH: TestingFixture = {
  name: "RGBW Par Light 3ch",
  shape: "Circle",
  functions: [],
  channels: [{ type: "Red" }, { type: "Green" }, { type: "Blue" }],
};

export const RBG_3CH_INT_MAPPED: TestingFixture = {
  name: "RGBW Par Light 3ch INT MAPPED",
  shape: "Circle",
  functions: [],
  channels: [
    { type: "Red", mapIntensity: true },
    { type: "Green", mapIntensity: true },
    { type: "Blue", mapIntensity: true },
  ],
};

export const RGBW_PAR: TestingFixture = {
  name: "RGBW Par Light",
  shape: "Circle",
  functions: [],
  channels: [
    { type: "Intensity" },
    { type: "Red" },
    { type: "Green" },
    { type: "Blue" },
    { type: "White" },
  ],
};

export const RGBW_UV_PAR: TestingFixture = {
  name: "RGBW UV Par",
  shape: "Circle",
  functions: [],
  channels: [
    { type: "Intensity" },
    { type: "Red" },
    { type: "Green" },
    { type: "Blue" },
    { type: "White" },
    { type: "UV" },
  ],
};

export const STROBE: TestingFixture = {
  name: "Strobe",
  shape: "Bar",
  functions: [],
  channels: [{ type: "White" }, { type: "Strobe" }],
};

export const ONE_CHANNEL_STROBE: TestingFixture = {
  name: "Strobe",
  shape: "Bar",
  functions: [],
  channels: [{ type: "Strobe", color: "ffffff" }],
};

export const createDefaultFixtures = async (page: Page) => {
  await createFixture(page, RGBW_PAR);
  await createFixture(page, RGBW_UV_PAR);
  await createFixture(page, STROBE);
  await createFixture(page, ONE_CHANNEL_STROBE);
};
