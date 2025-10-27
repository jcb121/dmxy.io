import { test } from "@playwright/test";

// test("has title", async ({ page }) => {
//   await page.goto("http://localhost:5173/");
// });

test("Creating a basic fixure", async ({ page, context }) => {
  await page.goto("http://localhost:5173/");

  // Click the get started link.

  const [res] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Fixures / create" }).click(),
  ]);

  await res.getByLabel("Name:").fill("Simple Red Light");
  await res.getByLabel("Channels:").fill("3");
  await res.getByLabel("Shape:").selectOption("Circle");

  await res.getByLabel("Function:").nth(0).selectOption("Intensity");
  await res.getByLabel("Function:").nth(1).selectOption("Red");
  await res.getByLabel("Function:").nth(2).selectOption("Functions");

  await res.getByTitle("Add Function").click();

  const functionPanel = res.locator(`[data-testid="function"]`).nth(0);

  await functionPanel.getByPlaceholder("Function name").fill("Sound");

  await functionPanel
    .getByTestId("functionChannel")
    .nth(0)
    .selectOption("Functions");

  await functionPanel.getByTestId("functionValue").nth(0).fill("51");

  await res.getByText("Save As").click();

  await res.close();

  await page.reload();

  await page.getByText("Simple Red Light").isVisible();
});
