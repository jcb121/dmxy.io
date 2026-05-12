import { test, expect } from "@playwright/test";
import { createDefaultFixtures, RGBW_PAR } from "./stepts/fixtures/create-default-fixtures";
import { setupDefaultFixtures } from "./stepts/venue/setup-default-fixtures";
import { addController } from "./stepts/main/add-controller";
import { addDefaultScenes } from "./stepts/scene/addDefaultScenes";

test("should create venue", async ({ page, context }) => {
  await createDefaultFixtures(page);

  await page.goto("/venue.html");

  await page.getByPlaceholder("Venue Name").fill("My Venue");

  await setupDefaultFixtures(page, RGBW_PAR.name);

  await page.getByText("Save As").click();

  await expect(page).toHaveURL(/.*venue_id=.+/);

  await page.goto("/");

  const mainPagePromise = context.waitForEvent("page");

  await page.getByText("My Venue").click();

  const mainPage = await mainPagePromise;

  const scenesPagePromise = context.waitForEvent("page");

  await mainPage.getByText("Scenes").click();

  const scenesPage = await scenesPagePromise;

  await addDefaultScenes(scenesPage);

  await addController(mainPage, "AKAI LPD8");
});
