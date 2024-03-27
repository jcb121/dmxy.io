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

export const sendState = async (
  port: SerialPort,
  state: Record<number, number>
) => {

  const a = new Uint8Array(513);
  new Array(513).fill(true).forEach((_, index) => {
    a[index] = state[index - 1] || 0x00;
  });
  console.log("sending", a);

  const writer = port.writable.getWriter();
  await writer.ready

  await port.setSignals({ requestToSend: true, break: true });
  console.log("Set signal");
  setTimeout(async () => {
    await port.setSignals({ requestToSend: true, break: false });
    console.log("Set signal2");
    setTimeout(() => {
      console.log("Writing");
      writer.write(a.buffer);
    }, 1);
  }, 1);
}
// };
