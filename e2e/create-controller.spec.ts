import { test, expect } from '@playwright/test';

test("should create a controller with buttons and dials", async ({page}) => {

  await page.goto("/controllers.html")

  await page.getByPlaceholder('Controller Name').fill('Button&Dials');

  await page.getByText('Add Button').click();
  await page.getByText('Add Button').click();

  await page.getByText('Add Dial').click();
  await page.getByText('Add Dial').click();

  await page.getByText('Save As').click();

  await expect(page).toHaveURL(/.*controllerId=.+/);

  await page.getByPlaceholder('Controller Name').fill('Button&Dials 2');

  await page.getByText('Save').click();

  await page.getByText('New Controller').click();

  await expect(page).toHaveURL("/controllers.html")

})