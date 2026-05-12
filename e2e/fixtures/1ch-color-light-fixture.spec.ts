import { test, expect } from "@playwright/test";

test("should create a 1ch colour light fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("1ch Colour");

  await page.getByText("Add Channel").click();

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const colourFunctionRow = page.getByTestId("functionSelect").nth(0);
  const colourSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });

  await colourFunctionRow.getByRole("combobox").selectOption("Colour");

  await colourFunctionRow.getByTitle("Channel Color").fill("#ff6600");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );

  await colourSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 102, 0)"
  );

  await colourSliderRow.getByTitle("channel-value").fill("0");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)"
  );
});
