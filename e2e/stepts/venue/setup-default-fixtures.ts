import { Page } from "@playwright/test";
import { setupFixture } from "./setup-fixture";

export const setupDefaultFixtures = async (page: Page, fixtureName: string) => {
  await setupFixture(page, { tags: ["odd"], name: fixtureName, x: 100, y: 50, channel: 0, index: 0 });
  await setupFixture(page, { tags: ["event"], name: fixtureName, x: 300, y: 50, channel: 10, index: 1 });
  await setupFixture(page, { tags: ["odd"], name: fixtureName, x: 100, y: 200, channel: 20, index: 2 });
  await setupFixture(page, { tags: ["event"], name: fixtureName, x: 300, y: 200, channel: 30, index: 3 });
};
