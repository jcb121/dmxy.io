import test, { expect } from "@playwright/test";
import { createFixture } from "./stepts/create-fixture";
import { RBG_3CH } from "./stepts/fixtures/create-default-fixtures";
import { createVenue } from "./stepts/venue/create-venue";
import { COLORS } from "./stepts/scene/addDefaultScenes";
import { createScene } from "./stepts/scene/ceateScene";

test("create red scene with un mapped 3ch light", async ({ page }) => {
  await createFixture(page, RBG_3CH);

  await createVenue(page, RBG_3CH);

  const [venuePage] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByText("Venue 1").click(),
  ]);

  const [scenesPage] = await Promise.all([
    venuePage.context().waitForEvent("page"),
    venuePage.getByText("Scenes").click(),
  ]);

  await createScene(scenesPage, {
    sceneName: "red",
    rules: [
      {
        selector: "all",
        frames: [[{ function: "Color", value: COLORS.red }]],
      },
    ],
  });

  await venuePage.getByText("show stage").click();
  await venuePage.getByText("RED").click();

  // wait for frame to render
  await page.waitForTimeout(50);

  await expect(venuePage.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 0, 0)",
  );
});
