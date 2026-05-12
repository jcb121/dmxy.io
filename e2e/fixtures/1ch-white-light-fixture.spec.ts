import { test, expect } from "@playwright/test";

test("should create a 1ch white light fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("1ch White");

  await page.getByText("Add Channel").click();

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const whiteFunctionRow = page.getByTestId("functionSelect").nth(0);
  const whiteSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });

  await whiteFunctionRow.getByRole("combobox").selectOption("White");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );

  await whiteSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)"
  );

  await whiteSliderRow.getByTitle("channel-value").fill("0");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );
});
