export const connect = async (): Promise<SerialPort> => {
  const port = await navigator.serial.requestPort();

  console.log(port);

  await port.open({
    baudRate: 250000,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
  });

  return port;
};
// export const DMXState: Record<number, number> = {
//   // 0: 0,
//   // 1: 255,
//   // 2: 255,
// };

const interval = 46; //46; //options.dmx_speed ? (1000 / options.dmx_speed) : 46;

let intervalhandle: NodeJS.Timeout | undefined;

export const startDMX = async (port: SerialPort) => {
  const writer = port.writable.getWriter();
  await writer.ready;

  intervalhandle = setInterval(() => sendUniverse(port, writer), interval);
};

export const stopDMX = () => {
  clearInterval(intervalhandle);
};

export const DMXState = new Uint8Array(513);
// new Array(513).fill(true).forEach((_, index) => {
//   a[index] = DMXState[index] || 0x00;
// });

export const sendUniverse = async (
  port: SerialPort,
  writer: WritableStreamDefaultWriter<unknown>
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
  writer.write(DMXState.buffer);
  // writer.releaseLock();
  // console.timeEnd("sendingUniverse");

  // }, 0);
  // }, 0);
};
// };
