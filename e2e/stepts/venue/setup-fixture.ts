import { test, expect, Page } from "@playwright/test";

export type setupFixtureProps = {
  name: string;
  x: number;
  y: number;
  index: number;
  channel: number;
  tags?: string[];
};

export const setupFixture = async (page: Page, props: setupFixtureProps) => {
  await test.step("setup a fixture on the stage", async () => {
    await expect(page).toHaveURL("/venue.html");

    const source = page
      .getByTestId("fixture-list-item")
      .filter({ hasText: props.name })
      .locator(`[draggable="true"]`);

    await source.dragTo(page.getByTestId("stage"), {
      sourcePosition: { x: 10, y: 10 },
      targetPosition: { x: props.x, y: props.y },
    });

    const fixture = page.getByTestId("stage-fixture").nth(props.index);

    await fixture.getByTitle("channel").fill(`${props.channel}`);

    for (const tag of props.tags ?? []) {
      await fixture.getByTitle("tag").fill(tag);
      await fixture.getByTitle("tag").press("Enter");
    }
  });
};
