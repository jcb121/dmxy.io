import React, { useEffect, useState } from "react";
import { getDatabase } from "../db";

export type VenueFixture = {
  id: string;
  x: number;
  y: number;
  /**
   *  this should be there, becuase in a venue you can't always change the channels
   */
  channel: number;
  fixtureId: string;
};

export type Venue = {
  name: string;
  id: string;
  venueFixtures: VenueFixture[];
  // slots: string[][];
  // channels: []
};

const sampleVenue: Venue = {
  name: "Underdogs",
  venueFixtures: [],
  id: crypto.randomUUID(),
};

export const VenueContext = React.createContext<{
  venues: Venue[];
  updateVenue: (v: Venue) => void;
  saveVenue: (v: Venue) => void;
  // setVenue: React.Dispatch<React.SetStateAction<Venue>>;
}>({
  venues: [sampleVenue],
  saveVenue: () => {},
  updateVenue: () => {},
});

export const VenueProvider = ({ children }: { children: React.ReactNode }) => {
  const [venues, setVenues] = useState<Venue[]>([sampleVenue]);

  useEffect(() => {
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("venues");
      console.log("GOT VEUES", data)

      if (data.length > 0) setVenues(data);
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

  const saveVenue = async (venue: Venue) => {
    console.log("SAVING VENUE", venue);

    const database = await getDatabase();
    database.put("venues", venue);
  };

  return (
    <VenueContext.Provider
      value={{
        venues,
        updateVenue,
        saveVenue,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
};
