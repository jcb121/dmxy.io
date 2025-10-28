import { useEffect } from "react";
import { useActiveVenue } from "../venues";
import { connnectUsbDevice, startDMX as startUSBDMX } from "./usb";
import { connnectSerialDevice, startDMX as startSerialDMX } from "./serial";

export const DMXState: Record<number, Uint8Array<ArrayBuffer>> = {};

export const interval = 46; //46; //options.dmx_speed ? (1000 / options.dmx_speed) : 46;

export const createUniverses = (universes: number[]) => {
  Object.values(universes).forEach((universe) => {
    DMXState[universe] = new Uint8Array(513);
  });
};

const DEFAULT_UNIVERSES = [0];

export const useDmx = () => {
  const venue = useActiveVenue((state) => state.venue);

  useEffect(() => {
    const universes =
      venue?.venueFixtures.reduce((universes, vFixture) => {
        const universe = vFixture.universe || 0;

        if (universes.includes(universe)) {
          return universes;
        }
        return [...universes, universe];
      }, [] as number[]) || DEFAULT_UNIVERSES;
    createUniverses(universes);
  }, [venue]);

  return async () => {
    try {
      for (const key in venue?.universes) {
        const element = venue.universes[key as unknown as number];

        if (element.protocol === "SERIAL") {
          const port = await connnectSerialDevice(element.vendorId);
          port && startSerialDMX(port, key as unknown as number);
        }
        if (element.protocol === "USB") {
          const device = await connnectUsbDevice(element.vendorId);
          device && startUSBDMX(device, key as unknown as number);
        }
      }
    } catch (e) {
      // disconnect?
    }
  };
};
