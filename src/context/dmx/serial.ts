import { DMXState } from ".";

export const registerSerialDevice = async () => {
  const port = await navigator.serial.requestPort({
    filters: [{ usbVendorId: 1027 }],
  });
  await port.open({
    baudRate: 250000,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
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

const SERIAL_BUFFER: Record<number, Uint8Array<ArrayBuffer>> = {};

const MIN_INTERVAL = 1000 / 30; // serial has more per-frame overhead than USB
const MAX_INTERVAL = 50;

export const startDMX = async (port: SerialPort, universe: number) => {
  if (!port.writable) return () => {};

  SERIAL_BUFFER[universe] = new Uint8Array(513);
  SERIAL_BUFFER[universe][0] = 0; // DMX start code

  let running = true;
  let adaptiveInterval = MAX_INTERVAL;
  const writer = port.writable.getWriter();

  (async () => {
    while (running) {
      const start = performance.now();
      let error = false;
      try {
        DMXState[universe].forEach((val, i) => {
          SERIAL_BUFFER[universe][i + 1] = val;
        });

        // @ts-expect-error Missing type
        await port.setSignals({ requestToSend: true, break: true });
        // @ts-expect-error Missing type
        await port.setSignals({ requestToSend: true, break: false });

        await writer.ready;
        await writer.write(SERIAL_BUFFER[universe]);
      } catch {
        error = true;
      }

      const elapsed = performance.now() - start;

      if (error) {
        adaptiveInterval = Math.min(MAX_INTERVAL, adaptiveInterval + 2);
      } else {
        adaptiveInterval = Math.max(MIN_INTERVAL, adaptiveInterval - 0.1);
      }

      const delay = error ? adaptiveInterval : adaptiveInterval - elapsed;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    writer.releaseLock();
  })();

  return () => {
    running = false;
  };
};
