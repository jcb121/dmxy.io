import { Page, test } from "@playwright/test";

export type _createSceneProps = {
  sceneName: string;
  bpm?: number;
  fade?: number;
  fadeGap?: number;
  rules: {
    selector: string | string[];
    frames: (
      | { function: "Color"; value: string }
      | { function: string; value: number }
    )[][];
  }[];
};

export const _createScene = async (
  page: Page,
  { sceneName, bpm, fade, fadeGap, rules }: _createSceneProps,
) => {
  await test.step("Create a scene", async () => {

    await page.getByText("New").click();
    await page.getByPlaceholder("Scene Name").fill(sceneName);

    if (bpm !== undefined) {
      await page.getByTestId("bpm-checkbox").check();
      await page.getByLabel("BPM").fill(`${bpm}`);
    }
    if (fade !== undefined) {
      await page.getByLabel("Fade", { exact: true }).fill(`${fade}`);
    }
    if (fadeGap !== undefined) {
      await page.getByLabel("FadeGap", { exact: true }).fill(`${fadeGap}`);
    }

    for (const rule of rules) {
      if (Array.isArray(rule.selector)) {
        await page.getByTestId("all-tags").getByText(rule.selector[0]).click();
        for (const selector of rule.selector.slice(1)) {
          await page
            .getByTestId("all-tags")
            .getByText(selector)
            .click({ modifiers: ["Shift"] });
        }
      } else {
        await page.getByTestId("all-tags").getByText(rule.selector).click();
      }

      for (const [frameIndex, frame] of rule.frames.entries()) {
        if (frameIndex > 0) {
          await page.getByTitle("Add Frame").click();
        }

        for (const setting of frame) {
          const frameLocator = page
            .getByTestId("frame")
            .filter({ hasText: `Frame ${frameIndex + 1}` });
          if (setting.function === "Color") {
            await frameLocator
              .locator("tr", {
                hasText: setting.function,
              })
              .locator(`input[type="color"]`)
              .fill(`${setting.value}`);
          } else {
            await frameLocator
              .locator("tr", {
                hasText: setting.function,
              })
              .getByRole("slider")
              .fill(`${setting.value}`);
          }
        }
      }
    }

    await page.getByText("Save As").click();
  });
};
