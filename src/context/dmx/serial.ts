import { DMXState, interval } from ".";

export const registerSerialDevice = async () => {
  const port = await navigator.serial.requestPort({
    filters: [{ usbVendorId: 1027 }],
  });

  return port;
};

export const connnectSerialDevice = async (vendorId: number) => {
  const ports = await navigator.serial.getPorts();

  const port = ports.find((port) => {
    const info = port.getInfo();
    return info.usbVendorId === vendorId;
  });

  return port;
};

export const sendUniverse = async (
  port: SerialPort,
  writer: WritableStreamDefaultWriter<unknown>,
  universe: Uint8Array<ArrayBuffer>
) => {
  // console.time("sendingUniverse");

  // console.log("sending", a);

  // const writer = port.writable.getWriter();
  // await writer.ready;
  // @ts-expect-error Missing type
  await port.setSignals({ requestToSend: true, break: true });
  // console.log("Set signal");
  // setTimeout(async () => {
  // @ts-expect-error Missing type
  await port.setSignals({ requestToSend: true, break: false });
  // await writer.ready;

  // console.log("Set signal2");
  // setTimeout(() => {
  // console.log("Writing");
  writer.write(universe.buffer);
  // writer.releaseLock();
  // console.timeEnd("sendingUniverse");

  // }, 0);
  // }, 0);
};

export const startDMX = async (port: SerialPort, universe: number) => {
  await port.open({
    baudRate: 250000,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
  });

  const writer = port.writable.getWriter();
  await writer.ready;

  const intervalhandle = setInterval(
    () => sendUniverse(port, writer, DMXState[universe]),
    interval
  );
  return () => {
    clearInterval(intervalhandle);
  };
};
