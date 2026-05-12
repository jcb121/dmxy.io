import { test, expect } from "@playwright/test";
import { RGB_SCENES } from "./stepts/scene/addDefaultScenes";
import { createScenes } from "./stepts/scene/ceateScene";
import { setupDmxTestVenue } from "./stepts/venue/setup-dmx-test-venue";
import { waitForUsbChannels } from "./stepts/dmx/wait-for-dmx";

type DmxCall = { data: number[]; timestamp: number };
type UsbMock = { dmxCalls: DmxCall[]; deviceOpened: boolean; requestDeviceCalled: boolean };

declare global {
  interface Window {
    __usbMock: UsbMock;
  }
}

test("should send correct DMX values over USB", async ({ page, context }) => {
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
  await expect(page).toHaveURL(/.*venue_id=.+/);

  await page.goto("/");
  await page.getByText("Register USB DMX").click();
  await page.waitForFunction(() => window.__usbMock.deviceOpened, { timeout: 5000 });

  const mainPagePromise = context.waitForEvent("page");
  await page.getByText("My Venue").click();
  const mainPage = await mainPagePromise;
  await page.close();

  await createScenes(mainPage, RGB_SCENES);

  await mainPage
    .getByTestId("device-dmx-universe-select")
    .filter({ hasText: "USB Device 0 UNI:" })
    .getByRole("combobox")
    .selectOption("0");

  // Intensity, Red, Green, Blue, White
  await mainPage.getByText("RED Fade 0 Gap 0").click();
  await waitForUsbChannels(mainPage, [255, 255, 0, 0, 0]);

  await mainPage.getByText("GREEN Fade 0 Gap 0").click();
  await waitForUsbChannels(mainPage, [255, 0, 255, 0, 0]);

  await mainPage.getByText("BLUE Fade 0 Gap 0").click();
  await waitForUsbChannels(mainPage, [255, 0, 0, 255, 0]);
});
