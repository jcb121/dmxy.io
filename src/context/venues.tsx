import React, { useEffect, useState } from "react";
import { getDatabase } from "../db";
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
};

export type Venue = {
  name: string;
  id: string;
  venueFixtures: VenueFixture[];
  scenes: Record<string, Scene>;
  // slots: string[][];
  // channels: []
};

export const sampleVenue = (name?: string): Venue => ({
  name: name || "New Venue",
  venueFixtures: [],
  id: crypto.randomUUID(),
  scenes: {},
});

type UpdateVenuteFixture = Partial<Omit<VenueFixture, "id">> & { id: string };

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

export const VenueContext = React.createContext<{
  venues: Venue[];
  createVenue: (name: string) => string;
  updateVenue: (v: Venue) => void;
  saveVenue: (v: Venue) => void;
  updateVenueFixture: (v: string, f: UpdateVenuteFixture) => void;
  // setVenue: React.Dispatch<React.SetStateAction<Venue>>;
}>({
  venues: [],
  createVenue: () => {
    return "";
  },
  saveVenue: () => {},
  updateVenue: () => {},
  updateVenueFixture: () => {},
});

export const VenueProvider = ({ children }: { children: React.ReactNode }) => {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("venues");
      console.log("GOT VEUES", data);

      setVenues(data.length > 0 ? data : [sampleVenue()]);
    })();
  }, []);

  const updateVenue = (venue: Venue) => {
    setVenues((state) => {
      const index = state.findIndex((v) => v.id === venue.id);
      if (index > -1) {
        state[index] = venue;
        return [...state];
      } else {
        return [...state, venue];
      }
    });
  };

  const updateVenueFixture = (
    venueId: string,
    venueFixture: UpdateVenuteFixture
  ) => {
    const venue = venues.find((v) => v.id === venueId);

    venue &&
      updateVenue({
        ...venue,
        venueFixtures: venue.venueFixtures.map((f) => {
          if (f.id === venueFixture.id) {
            return {
              ...f,
              ...venueFixture,
            };
          }
          return f;
        }),
      });
  };

  const saveVenue = async (venue: Venue) => {
    console.log("SAVING VENUE", venue);

    const database = await getDatabase();
    database.put("venues", venue);
  };

  const createVenue = (name: string) => {
    const newVenue = sampleVenue(name);
    setVenues((state) => [...state, newVenue]);
    return newVenue.id;
  };

  return (
    <VenueContext.Provider
      value={{
        venues,
        updateVenue,
        saveVenue,
        updateVenueFixture,
        createVenue,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
};
