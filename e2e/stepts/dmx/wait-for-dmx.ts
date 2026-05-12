import { Page } from "@playwright/test";

/** Wait until the latest USB DMX frame matches the expected channel values starting at channel 0. */
export const waitForUsbChannels = async (
  page: Page,
  expected: number[],
  timeout = 5000,
) => {
  await page.waitForFunction(
    (expected) => {
      const last =
        window.__usbMock.dmxCalls[window.__usbMock.dmxCalls.length - 1];
      if (!last) return false;
      return expected.every((val, i) => last.data[i] === val);
    },
    expected,
    { timeout, polling: 200 },
  );
};

/** Wait until the latest serial DMX frame matches the expected channel values.
 *  The start code (data[0] === 0) is checked automatically; `expected` maps to data[1+]. */
export const waitForSerialChannels = async (
  page: Page,
  expected: number[],
  timeout = 5000,
) => {
  await page.waitForFunction(
    (expected) => {
      const last =
        window.__serialMock.serialCalls[
          window.__serialMock.serialCalls.length - 1
        ];
      if (!last) return false;
      return (
        last.data[0] === 0 && expected.every((val, i) => last.data[i + 1] === val)
      );
    },
    expected,
    { timeout, polling: 200 },
  );
};
