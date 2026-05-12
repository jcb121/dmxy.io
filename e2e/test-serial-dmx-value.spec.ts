import { test } from "@playwright/test";
import { RGB_SCENES } from "./stepts/scene/addDefaultScenes";
import { createScenes } from "./stepts/scene/ceateScene";
import { setupDmxTestVenue } from "./stepts/venue/setup-dmx-test-venue";
import { waitForSerialChannels } from "./stepts/dmx/wait-for-dmx";

type SerialCall = { data: number[]; timestamp: number };
type SerialMock = { serialCalls: SerialCall[]; portOpened: boolean; requestPortCalled: boolean };

declare global {
  interface Window {
    __serialMock: SerialMock;
  }
}

test("should send correct DMX values over serial", async ({ page, context }) => {
  await context.addInitScript(() => {
    const state = {
      serialCalls: [] as { data: number[]; timestamp: number }[],
      portOpened: false,
      requestPortCalled: false,
    };

    const mockWriter = {
      ready: Promise.resolve(),
      write: (data: Uint8Array) => {
        state.serialCalls.push({ data: Array.from(data), timestamp: Date.now() });
        return Promise.resolve();
      },
      releaseLock: () => {},
    };

    const mockPort = {
      open: () => {
        state.portOpened = true;
        return Promise.resolve();
      },
      setSignals: () => Promise.resolve(),
      get writable() {
        return { getWriter: () => mockWriter };
      },
    };

    Object.defineProperty(navigator, "serial", {
      value: {
        requestPort: () => {
          state.requestPortCalled = true;
          localStorage.setItem("serialPortGranted", "true");
          return Promise.resolve(mockPort);
        },
        getPorts: () =>
          Promise.resolve(
            localStorage.getItem("serialPortGranted") ? [mockPort] : [],
          ),
      },
      writable: false,
    });

    window.__serialMock = state;
  });

  await setupDmxTestVenue(page);

  await page.goto("/");
  await page.getByText("Register Serial DMX").click();
  await page.waitForFunction(() => window.__serialMock.portOpened, { timeout: 5000 });

  const mainPagePromise = context.waitForEvent("page");
  await page.getByText("My Venue").click();
  const mainPage = await mainPagePromise;
  await page.close();

  await createScenes(mainPage, RGB_SCENES);

  await mainPage
    .getByTestId("device-dmx-universe-select")
    .filter({ hasText: "SERIAL Device 0 UNI:" })
    .getByRole("combobox")
    .selectOption("0");

  // Intensity, Red, Green, Blue, White (start code 0 is checked automatically)
  await mainPage.getByText("RED Fade 0 Gap 0").click();
  await waitForSerialChannels(mainPage, [255, 255, 0, 0, 0]);

  await mainPage.getByText("GREEN Fade 0 Gap 0").click();
  await waitForSerialChannels(mainPage, [255, 0, 255, 0, 0]);

  await mainPage.getByText("BLUE Fade 0 Gap 0").click();
  await waitForSerialChannels(mainPage, [255, 0, 0, 255, 0]);
});
