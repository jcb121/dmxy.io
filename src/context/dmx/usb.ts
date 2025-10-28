import { DMXState, interval } from ".";

export const registerUsbDevice = async () => {
  const device = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x16c0 }],
  });
  await device.open();

  return device;
};

export const connnectUsbDevice = async (vendorId: number) => {
  const devices = await navigator.usb.getDevices();

  const device = devices.find((d) => {
    return !d.opened && d.vendorId === vendorId;
  });

  if (!device) return;

  await device.open();

  // if (
  //   device.configuration === null ||
  //   device.configuration.configurationValue !== 1
  // ) {
  //   await device.selectConfiguration(1);
  // }

  // // Claim interface 0
  // const ifaceNumber = device.configuration.interfaces[0].interfaceNumber;

  // await device.claimInterface(ifaceNumber);

  // await new Promise((r) => setTimeout(r, 100));

  // await device.selectAlternateInterface(ifaceNumber, 0);

  return device;
};

export const sendUniverse = async (
  device: USBDevice,
  universe: Uint8Array<ArrayBuffer>
) => {
  for (let i = 1; i < universe.length; i++) {
    const channel = i; // DMX Channel (0-indexed, so 0 = DMX 1)
    const value = universe[i]; // DMX Value (0-255)

    // This is the "set single channel" command
    // We are guessing request: 1, as 0 is your non-working "set multiple"
    // Some firmware might use a different request number, but 1 is common.
    await device.controlTransferOut(
      {
        requestType: "vendor",
        recipient: "device",
        request: 1, // Vendor-specific request for "Set Single Channel"
        value: value, // The DMX value to set
        index: channel - 1, // The DMX channel to set
      },
      new Uint8Array(0) // No data payload is sent
    );
  }
};

export const startDMX = async (port: USBDevice, universe: number) => {
  const intervalhandle = setInterval(
    () => sendUniverse(port, DMXState[universe]),
    interval / 2
  );
  return () => {
    clearInterval(intervalhandle);
  };
};
