import { test, expect } from "@playwright/test";

test("should create a 3ch RGB fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("3ch RGB");

  for (let i = 0; i < 3; i++) { await page.getByText("Add Channel").click(); }

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const redFunctionRow = page.getByTestId("functionSelect").nth(0);
  const greenFunctionRow = page.getByTestId("functionSelect").nth(1);
  const blueFunctionRow = page.getByTestId("functionSelect").nth(2);
  const redSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });
  const greenSliderRow = page.locator("tr").filter({ hasText: "Ch: 2" });
  const blueSliderRow = page.locator("tr").filter({ hasText: "Ch: 3" });

  await redFunctionRow.getByRole("combobox").selectOption("Red");
  await greenFunctionRow.getByRole("combobox").selectOption("Green");
  await blueFunctionRow.getByRole("combobox").selectOption("Blue");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );

  await redSliderRow.getByTitle("channel-value").fill("255");
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 0, 0)"
  );

  await redSliderRow.getByTitle("channel-value").fill("0");
  await greenSliderRow.getByTitle("channel-value").fill("255");
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 255, 0)"
  );

  await greenSliderRow.getByTitle("channel-value").fill("0");
  await blueSliderRow.getByTitle("channel-value").fill("255");
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 255)"
  );

  await redSliderRow.getByTitle("channel-value").fill("255");
  await greenSliderRow.getByTitle("channel-value").fill("255");
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)"
  );
});
