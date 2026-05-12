import { Page } from "@playwright/test";
import { RGBW_PAR } from "../fixtures/create-default-fixtures";
import { createFixture } from "../create-fixture";
import { setupFixture } from "./setup-fixture";

export const setupDmxTestVenue = async (page: Page) => {
  await createFixture(page, RGBW_PAR);

  await page.goto("/venue.html");
  await page.getByPlaceholder("Venue Name").fill("My Venue");
  await setupFixture(page, {
    tags: ["odd"],
    name: RGBW_PAR.name,
    x: 100,
    y: 50,
    channel: 1,
    index: 0,
  });
  await page.getByText("Save As").click();
};
