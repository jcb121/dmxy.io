import { test, expect } from "@playwright/test";

test("should create a lighting fixture", async ({ page }) => {

  await page.goto("/");

  await page.getByText("Fixtures").click();

  await expect(page).toHaveURL("/fixtures.html");

  await page.getByPlaceholder("Fixture name").fill("RGBW Par Light");

  for (let i = 0; i < 5; i++) { await page.getByText("Add Channel").click(); }

  await page.getByTestId("fixture_option").filter({
    hasText: "Circle"
  }).click();


  await page.getByTestId("functionSelect").nth(0).getByRole("combobox").selectOption("Intensity");
  await page.getByTestId("functionSelect").nth(1).getByRole("combobox").selectOption("Red");
  await page.getByTestId("functionSelect").nth(2).getByRole("combobox").selectOption("Green");
  await page.getByTestId("functionSelect").nth(3).getByRole("combobox").selectOption("Blue");
  await page.getByTestId("functionSelect").nth(4).getByRole("combobox").selectOption("White");
  await page.getByTestId("functionSelect").nth(5).getByRole("combobox").selectOption("Functions");

  await page.getByTitle("Add Function").click();

  const functionPane = page.getByTestId("fixture-function").nth(0);
  await functionPane.getByPlaceholder("Function name").fill("Pulse");
  await functionPane.getByTestId("functionChannel").selectOption("Ch 6");
  await functionPane.getByTestId("functionValue").first().fill("100");

  await page.getByTitle("Add Function").click();

  const functionSecondPane = page.getByTestId("fixture-function").nth(1);
  await functionSecondPane.getByPlaceholder("Function name").fill("Sound");
  await functionSecondPane.getByTestId("functionChannel").selectOption("Ch 6");
  await functionSecondPane.getByTestId("functionValue").first().fill("200");

  await page.getByText("Save As").click();

  await expect(page).toHaveURL(/.*fixtureId=.+/);
});
