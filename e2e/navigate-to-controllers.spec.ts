import { test, expect } from '@playwright/test';

test("should navigate to the controllers page and open the default controller", async ({page}) => {

  await page.goto("/")

  await page.getByText('Controllers').click();

  await expect(page).toHaveURL("/controllers.html")

  await page.getByText('AKAI LPD8').click();
})