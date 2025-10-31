import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActiveVenue } from "../venues";
import { getUsbDevices, startDMX as startUSBDMX } from "./usb";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { getSerialPorts, startDMX as startSerialDMX } from "./serial";

export const DMXState: Record<number, Uint8Array<ArrayBuffer>> = {};

export const interval = 46; //46; //options.dmx_speed ? (1000 / options.dmx_speed) : 46;

export const createUniverses = (universes: number[]) => {
  Object.values(universes).forEach((universe) => {
    DMXState[universe] = new Uint8Array(512);
  });
};

const DEFAULT_UNIVERSES = [0];

const useDmxConnection = create<Record<DeviceKey, DMXUniverse>>()(
  persist(
    () => {
      return {};
    },
    {
      name: "dmx-connection-map",
    }
  )
);

type DeviceKey = `${DeviceType}_${DeviceIndex}`;

type DeviceType = "USB" | "SERIAL";
type DeviceIndex = number;
type DMXUniverse = number;

type DmxDevice = {
  type: DeviceType;
  deviceIndex: DeviceIndex;
};

export const useDmx = (
  autoStart: boolean = false
): {
  start: () => void;
  devices: DmxDevice[];
  connections: Record<`${DeviceType}_${DeviceIndex}`, DMXUniverse>;
  connect: (device: DmxDevice, universe?: number) => void;
} => {
  const [start, setStart] = useState(autoStart);

  const venue = useActiveVenue((state) => state.venue);

  const [usbDevices, setUsbDevices] = useState<USBDevice[]>([]);

  const [ports, setPorts] = useState<SerialPort[]>([]);

  const devices = useMemo<DmxDevice[]>(() => {
    return [
      ...usbDevices.map(
        (_d, i) => ({ type: "USB", deviceIndex: i } satisfies DmxDevice)
      ),
      ...ports.map(
        (_d, i) => ({ type: "SERIAL", deviceIndex: i } satisfies DmxDevice)
      ),
    ];
  }, [usbDevices, ports]);

  const connections = useDmxConnection((state) => state);

  const universes = useMemo(() => {
    return (
      venue?.venueFixtures.reduce((universes, vFixture) => {
        const universe = vFixture.universe || 0;
        if (universes.includes(universe)) {
          return universes;
        }
        return [...universes, universe];
      }, [] as number[]) || DEFAULT_UNIVERSES
    );
  }, [venue]);

  // this should be in main?
  useEffect(() => {
    createUniverses(universes);
  }, [universes]);

  useEffect(() => {
    (async () => {
      const devices = await getUsbDevices();
      setUsbDevices(devices);
    })();
    (async () => {
      const ports = await getSerialPorts();

      setPorts(ports);
    })();
    return () => {
      // usbDevices.forEach((d) => d.close());
      // ports.forEach((port) => port.close());
    };
  }, [universes]);

  const cancelDMX = useRef<(() => void)[]>([]);

  useEffect(() => {
    cancelDMX.current.forEach((cancel) => cancel());
    cancelDMX.current = [];

    if (start === false) {
      return;
    }

    if (devices.length === 0) return;

    (async () => {
      for (const deviceKey in connections) {
        const universe = connections[deviceKey as DeviceKey];

        const [type, deviceIndex] = deviceKey.split("_");

        if (type === "USB") {
          const device = usbDevices[parseInt(deviceIndex)];
          if (!device) return;
          const stopDMX = await startUSBDMX(device, universe);
          cancelDMX.current.push(stopDMX);
        }

        if (type === "SERIAL") {
          const port = ports[parseInt(deviceIndex)];
          if (!port) return;
          const stopDMX = await startSerialDMX(port, universe);
          cancelDMX.current.push(stopDMX);
        }
      }
    })();
    return () => {
      cancelDMX.current.forEach((cancel) => cancel());
    };
  }, [autoStart, connections, devices, start, ports, usbDevices]);

  const connect = useCallback(
    (device: DmxDevice | undefined, universe?: number) => {
      useDmxConnection.setState((state) => {
        if (!device) return state;

        if (typeof universe === "undefined") {
          delete state[`${device.type}_${device.deviceIndex}`];
          return { ...state };
        }

        state[`${device.type}_${device.deviceIndex}`] = universe;
        return { ...state };
      });
    },
    []
  );

  return {
    start: () => {
      setStart((state) => !state);
    },
    devices,
    connections,
    connect,
  };
};
