import { test, expect } from "@playwright/test";

test("should create a 2ch white strobe fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("2ch Strobe");

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  await page.getByText("Add Channel").click();

  const strobeFunctionRow = page.getByTestId("functionSelect").nth(0);
  const whiteFunctionRow = page.getByTestId("functionSelect").nth(1);


  await strobeFunctionRow.getByRole("combobox").selectOption("Strobe");
  await whiteFunctionRow.getByRole("combobox").selectOption("White");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)",
  );
  const whiteSliderRow = page.locator("tr").filter({ hasText: "Ch: 2" });
  await whiteSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(0, 0, 0)",
  );

  const strobeSliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });
  await strobeSliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});
