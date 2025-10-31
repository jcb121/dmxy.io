import { DMXState, interval } from ".";

export const registerUsbDevice = async () => {
  const device = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x16c0 }],
  });
  await device.open();

  return device;
};

export const getUsbDevices = async () => {
  const devices = await navigator.usb.getDevices();

  for (const usbDevice of devices) {
    await usbDevice.open();
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

export const startDMX = async (port: USBDevice, universe: number) => {
  const intervalhandle = setInterval(
    () => sendUniverse(port, DMXState[universe]),
    interval
  );
  return () => {
    clearInterval(intervalhandle);
  };
};
