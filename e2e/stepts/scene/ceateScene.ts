import { Page } from "@playwright/test";
import { _createScene, _createSceneProps } from "./_createScene";


const ensureScenesPage = async (page: Page): Promise<Page> => {
  const url = page.url();
  if (url.includes("main.html") && url.includes("venue_id")) {
    const scenesPagePromise = page.context().waitForEvent("page");
    await page.getByText("Scenes").click();
    return scenesPagePromise;
  }
  return page;
};

export const createScene = async (page: Page, scene: _createSceneProps) => {
  page = await ensureScenesPage(page);
  await _createScene(page, scene);
};

export const createScenes = async (page: Page, scenes: _createSceneProps[]) => {
  page = await ensureScenesPage(page);

  for (const s of scenes) {
    await _createScene(page, s);

    await page.screenshot();
    await page.getByText("New").click();
  }
};