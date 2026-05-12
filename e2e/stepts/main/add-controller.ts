import { test, expect, Page } from "@playwright/test";
export const addController = async (
  page: Page,
  controllerName: string = "AKAI LPD8",
) => {
  await test.step("Add controller to main", async () => {
    await expect(page).toHaveURL(/.*\/main.html\?venue_id=.+/);

    await page.getByTestId("add_controller").selectOption(controllerName);
  });
};
