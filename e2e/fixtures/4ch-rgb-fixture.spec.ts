import { test, expect } from "@playwright/test";

test("should create a 4ch RGB + Intensity fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("4ch RGB");

  for (let i = 0; i < 4; i++) { await page.getByText("Add Channel").click(); }

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const redFunctionRow = page.getByTestId("functionSelect").nth(0);
  const greenFunctionRow = page.getByTestId("functionSelect").nth(1);
  const blueFunctionRow = page.getByTestId("functionSelect").nth(2);
  const intensityFunctionRow = page.getByTestId("functionSelect").nth(3);
  const redSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });
  const greenSliderRow = page.locator("tr").filter({ hasText: "Ch: 2" });
  const blueSliderRow = page.locator("tr").filter({ hasText: "Ch: 3" });
  const intensitySliderRow = page.locator("tr").filter({ hasText: "Ch: 4" });

  await redFunctionRow.getByRole("combobox").selectOption("Red");
  await greenFunctionRow.getByRole("combobox").selectOption("Green");
  await blueFunctionRow.getByRole("combobox").selectOption("Blue");
  await intensityFunctionRow.getByRole("combobox").selectOption("Intensity");

  await redSliderRow.getByTitle("channel-value").fill("255");
  await greenSliderRow.getByTitle("channel-value").fill("255");
  await blueSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgba(255, 255, 255, 0)"
  );

  await intensitySliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)"
  );

  await intensitySliderRow.getByTitle("channel-value").fill("0");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgba(255, 255, 255, 0)"
  );
});
