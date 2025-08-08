import { create } from "zustand";
import { Venue } from "./venues";

export const useZones = create<{
  zones: string[];
  setZones: (venue: Venue) => void;
  setActiveZone: (setActiveZone: string) => void;
  activeZone?: string;
}>((set) => {
  return {
    zones: ["all"],
    setActiveZone: (activeZone: string) =>
      set((state) => ({
        ...state,
        activeZone,
      })),
    setZones: (venue: Venue) =>
      set((state) => {
        const zones = [
          ...new Set(
            venue.venueFixtures.reduce((zones, vFixture) => {
              return [...zones, ...vFixture.tags];
            }, ["all"] as string[])
          ),
        ].sort();
        return {
          ...state,
          zones,
          activeZone: zones[0],
        };
      }),
  };
});
