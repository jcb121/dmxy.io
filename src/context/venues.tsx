import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChannelSimpleFunction } from "./fixtures";

import { Scene } from "./scenes";

export type VenueFixture = {
  id: string;
  x: number;
  y: number;
  tags: Array<string>; // selectors
  /**
   *  this should be there, becuase in a venue you can't always change the channels
   */
  overwrites: Partial<Record<ChannelSimpleFunction, string>>;
  channel: number;
  fixtureId: string;
  universe?: number;
  area?: number;
};

export type Venue = {
  name: string;
  id: string;
  venueFixtures: VenueFixture[];
  scenes: Record<string, Scene>;
};

export const sampleVenue = (name?: string): Venue => ({
  name: name || "New Venue",
  venueFixtures: [],
  id: crypto.randomUUID(),
  scenes: {},
});

export const useVenues = create<{
  venues: Venue[];
  add: (f: Venue) => void;
  update: (f: Venue) => void;
  remove: (f: Venue) => void;
}>()(
  persist(
    (set) => {
      return {
        venues: [],
        add: (venue) => {
          set((state) => {
            const original = !state.venues.find((v) => v.id === venue.id);
            return {
              ...state,
              venues: original
                ? [...state.venues, venue]
                : state.venues.map((v) => (v.id === venue.id ? venue : v)),
            };
          });
        },
        update: (venue) => {
          set((state) => ({
            ...state,
            venues: state.venues.map((f) => (f.id === venue.id ? venue : f)),
          }));
        },
        remove: (venue) => {
          set((state) => ({
            ...state,
            venues: state.venues.filter((f) => f.id !== venue.id),
          }));
        },
      };
    },
    {
      name: "venues",
    }
  )
);

window.addEventListener("storage", (e: StorageEvent) => {
  if (e.key === useVenues.persist.getOptions().name && e.newValue) {
    useVenues.persist.rehydrate();
  }
});

export const useActiveVenue = create<{
  venue?: Venue;
  setActiveVenue: (id: string) => void;
  addScene: (s: Scene) => void;
}>((set) => ({
  addScene: (scene) => {
    set((state) => {
      if (state.venue) {
        const venuesState = useVenues.getState();
        const venue = {
          ...state.venue,
          scenes: {
            ...state.venue.scenes,
            [scene.id]: scene,
          },
        };
        venuesState.update(venue);

        return {
          ...state,
          venue,
        };
      }
      return state;
    });
  },
  setActiveVenue: (id: string) => {
    const venue = useVenues.getState().venues.find((v) => v.id === id);
    set((state) => ({
      ...state,
      venue,
    }));
  },
}));
