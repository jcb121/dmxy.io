import { DMXState } from ".";

export const registerUsbDevice = async () => {
  const device = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x16c0 }],
  });
  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);

  return device;
};

export const getUsbDevices = async () => {
  const devices = await navigator.usb.getDevices();

  for (const usbDevice of devices) {
    await usbDevice.open();
    await usbDevice.selectConfiguration(1);
    await usbDevice.claimInterface(0);
  }

  return devices;
};

export const sendUniverse = async (
  device: USBDevice,
  universe: Uint8Array<ArrayBuffer>
) => {
  await device.controlTransferOut(
    {
      requestType: "vendor",
      recipient: "device",
      request: 2,
      value: 512,
      index: 0,
    },
    universe
  );
};

const MIN_INTERVAL = 1000 / 44; // ~22.7ms — 44Hz ceiling
const MAX_INTERVAL = 50;         // ~20Hz floor

export const startDMX = async (port: USBDevice, universe: number) => {
  let running = true;
  let interval = MAX_INTERVAL; // start conservative, tune down toward MIN

  (async () => {
    while (running) {
      const start = performance.now();
      let error = false;
      try {
        await sendUniverse(port, DMXState[universe]);
      } catch {
        console.log("error", interval)
        error = true;
      }
      const elapsed = performance.now() - start;

      if (error) {
        interval = Math.min(MAX_INTERVAL, interval + 2);
      } else {
        interval = Math.max(MIN_INTERVAL, interval - 0.1);
      }

      const delay = error ? interval : interval - elapsed;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  })();

  return () => {
    running = false;
  };
};
