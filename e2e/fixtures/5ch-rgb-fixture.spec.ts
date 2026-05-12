import { test, expect } from "@playwright/test";

test("should create a 5ch RGB + White + Intensity fixture", async ({
  page,
}) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("5ch RGBW");

  for (let i = 0; i < 5; i++) { await page.getByText("Add Channel").click(); }

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const redFunctionRow = page.getByTestId("functionSelect").nth(0);
  const greenFunctionRow = page.getByTestId("functionSelect").nth(1);
  const blueFunctionRow = page.getByTestId("functionSelect").nth(2);
  const whiteFunctionRow = page.getByTestId("functionSelect").nth(3);
  const intensityFunctionRow = page.getByTestId("functionSelect").nth(4);
  const redSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });
  const whiteSliderRow = page.locator("tr").filter({ hasText: "Ch: 4" });
  const intensitySliderRow = page.locator("tr").filter({ hasText: "Ch: 5" });

  await redFunctionRow.getByRole("combobox").selectOption("Red");
  await greenFunctionRow.getByRole("combobox").selectOption("Green");
  await blueFunctionRow.getByRole("combobox").selectOption("Blue");
  await whiteFunctionRow.getByRole("combobox").selectOption("White");
  await intensityFunctionRow.getByRole("combobox").selectOption("Intensity");

  await intensitySliderRow.getByTitle("channel-value").fill("255");

  // RGB channels drive the main color; white channel does not bleed into it
  await redSliderRow.getByTitle("channel-value").fill("255");
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 0, 0)"
  );

  await expect(page.getByTestId("fixture").first()).toHaveCSS("--White", "0");

  await whiteSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS("--White", "255");

  // main background unchanged — white is additive overlay only
  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 0, 0)"
  );
});
