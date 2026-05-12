import { expect, Page } from "@playwright/test";
import { setupFixture } from "./setup-fixture";
import { TestingFixture } from "../fixtures/create-default-fixtures";

export const createVenue = async (page: Page, fixture: TestingFixture) => {
  if (new URL(page.url()).pathname !== "/") {
    await page.goto("/");
  }
  await page.getByText("Venues").click();

  await page.getByText("Create Venue").click();

  await expect(page).toHaveURL("/venue.html");

  await page.getByPlaceholder("Venue Name").fill("Venue 1")

  await setupFixture(page, {
    tags: ["even"],
    name: fixture.name,
    x: 50,
    y: 50,
    channel: 10,
    index: 0,
  });

  await page.getByText("Save As").click()
  await page.getByText("Back").click()
};
