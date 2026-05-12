import { test } from "@playwright/test";
import { COLORS } from "./stepts/scene/addDefaultScenes";
import { createScene } from "./stepts/scene/ceateScene";
import { setupDmxTestVenue } from "./stepts/venue/setup-dmx-test-venue";
import { waitForUsbChannels } from "./stepts/dmx/wait-for-dmx";

type DmxCall = { data: number[]; timestamp: number };
type UsbMock = { dmxCalls: DmxCall[]; deviceOpened: boolean; requestDeviceCalled: boolean };

declare global {
  interface Window {
    __usbMock: UsbMock;
  }
}

// BPM=120 → 500ms per beat. waitForUsbChannels polls every 200ms with a 1500ms
// timeout, so each colour is caught within 1.5 beats regardless of starting phase.
const BEAT_MS = 500;
const BEAT_TIMEOUT = BEAT_MS * 3;

test("should cycle DMX values between red and green frames", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    const state = {
      dmxCalls: [] as { data: number[]; timestamp: number }[],
      deviceOpened: false,
      requestDeviceCalled: false,
    };

    const mockDevice = {
      open: () => {
        state.deviceOpened = true;
        return Promise.resolve();
      },
      selectConfiguration: () => Promise.resolve(),
      claimInterface: () => Promise.resolve(),
      controlTransferOut: (_setup: unknown, data: Uint8Array) => {
        state.dmxCalls.push({ data: Array.from(data), timestamp: Date.now() });
        return Promise.resolve({ status: "ok" });
      },
      transferOut: () => Promise.resolve({ status: "ok" }),
      close: () => Promise.resolve(),
      vendorId: 0x16c0,
    };

    Object.defineProperty(navigator, "usb", {
      value: {
        requestDevice: () => {
          state.requestDeviceCalled = true;
          localStorage.setItem("usbDeviceGranted", "true");
          return Promise.resolve(mockDevice);
        },
        getDevices: () =>
          Promise.resolve(
            localStorage.getItem("usbDeviceGranted") ? [mockDevice] : [],
          ),
      },
      writable: false,
    });

    window.__usbMock = state;
  });

  await setupDmxTestVenue(page);

  await page.goto("/");
  await page.getByText("Register USB DMX").click();
  await page.waitForFunction(() => window.__usbMock.deviceOpened, {
    timeout: 5000,
  });

  const mainPagePromise = context.waitForEvent("page");
  await page.getByText("My Venue").click();
  const mainPage = await mainPagePromise;
  await page.close();

  await mainPage
    .getByTestId("device-dmx-universe-select")
    .filter({ hasText: "USB Device 0 UNI:" })
    .getByRole("combobox")
    .selectOption("0");

  await createScene(mainPage, {
    sceneName: "Red to Green",
    bpm: 120,
    rules: [
      {
        selector: "all",
        frames: [
          [
            { function: "Color", value: COLORS.red },
            { function: "Intensity", value: 255 },
          ],
          [
            { function: "Color", value: COLORS.green },
            { function: "Intensity", value: 255 },
          ],
        ],
      },
    ],
  });

  await mainPage.getByText("Red to Green").click();

  // Intensity, Red, Green, Blue, White
  // The starting phase is indeterminate, so allow up to 1.5 beats to see each colour.
  await waitForUsbChannels(mainPage, [255, 255, 0, 0, 0], BEAT_TIMEOUT);
  await waitForUsbChannels(mainPage, [255, 0, 255, 0, 0], BEAT_TIMEOUT);
  await waitForUsbChannels(mainPage, [255, 255, 0, 0, 0], BEAT_TIMEOUT);
});
