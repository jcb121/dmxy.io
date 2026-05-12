import { test, expect } from "@playwright/test";

test("should create a 1ch white strobe fixture", async ({ page }) => {
  await page.goto("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("1ch Strobe");

  await page.getByText("Add Channel").click();

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();

  const functionRow = page.getByTestId("functionSelect").nth(0);
  const sliderRow = page.locator("tr").filter({ hasText: "Ch: 1" });

  await functionRow.getByRole("combobox").selectOption("Strobe");

  await functionRow.getByTitle("Channel Color").fill(`#ffffff`);

  await sliderRow.getByTitle("channel-value").fill("255");

  await expect(page.getByTestId("fixture").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)"
  );
});
