import { DMXState, interval } from ".";

export const registerSerialDevice = async () => {
  const port = await navigator.serial.requestPort({
    filters: [{ usbVendorId: 1027 }],
  });

  return port;
};

export const getSerialPorts = async () => {
  const ports = await navigator.serial.getPorts();
  for (const port of ports) {
    await port.open({
      baudRate: 250000,
      dataBits: 8,
      stopBits: 2,
      parity: "none",
    });
  }
  return ports;
};

export const sendUniverse = async (port: SerialPort, universe: number) => {
  SERIAL_BUFFER[universe][0] = 0;
  DMXState[universe].forEach((val, index) => {
    SERIAL_BUFFER[universe][index + 1] = val;
  });

  const writer = port.writable.getWriter();
  await writer.ready;

  // @ts-expect-error Missing type
  await port.setSignals({ requestToSend: true, break: true });
  // @ts-expect-error Missing type
  await port.setSignals({ requestToSend: true, break: false });

  await writer.write(SERIAL_BUFFER[universe]);
  writer.releaseLock();
};
const SERIAL_BUFFER: Record<number, Uint8Array<ArrayBuffer>> = {};

export const startDMX = async (port: SerialPort, universe: number) => {
  SERIAL_BUFFER[universe] = new Uint8Array(513);
  const intervalhandle = setInterval(
    () => sendUniverse(port, universe),
    interval
  );
  return () => {
    clearInterval(intervalhandle);
  };
};
