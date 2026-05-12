import { test, expect, Page } from "@playwright/test";
import { TestingFixture } from "./fixtures/create-default-fixtures";

export const createFixture = async (
  page: Page,
  { name, channels, shape, functions }: TestingFixture,
) => {
  await test.step("Create a fixture", async () => {
    await page.goto("/fixtures.html");

    await page.getByPlaceholder("Fixture name").fill(name);

    for (let i = 0; i < channels.length; i++) {
      await page.getByText("Add Channel").click();
    }

    await page
      .getByTestId("fixture_option")
      .filter({
        hasText: shape,
      })
      .click();

    await page.screenshot();

    for (const channel of channels) {
      const index = channels.indexOf(channel);

      const channelPane = page.getByTestId("functionSelect").nth(index);

      await channelPane.getByRole("combobox").selectOption(channel.type);

      if (channel.mapIntensity) {
        await channelPane.getByTestId("mapIntensity").click();
      }

      if (channel.color) {
        await channelPane
          .getByTitle("Channel Color")
          .fill(`#${channel.color.replace("#", "")}`);
      }
    }

    for (const func of functions) {
      const index = functions.indexOf(func);

      const functionPane = page.getByTestId("fixture-function").nth(index);
      await functionPane.getByPlaceholder("Function name").fill(func.name);
      await functionPane
        .getByTestId("functionChannel")
        .selectOption(func.channel);
      await functionPane
        .getByTestId("functionValue")
        .first()
        .fill(`${func.value}`);
    }
    await page.getByText("Save As").click();

    await expect(page).toHaveURL(/.*fixtureId=.+/);

    await page.screenshot();
  });
};
