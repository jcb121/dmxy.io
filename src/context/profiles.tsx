import { useEffect, useState } from "react";
import { ChannelSimpleFunction } from "./fixtures";
import { getDatabase } from "../db";
import React from "react";

export type ProfileState = {
  id: string;
  state: Record<ChannelSimpleFunction, number>;
  value: Record<ChannelSimpleFunction, string>;
  // hold?: number;
  // fadeIn?: number;
  // fadeOut?: number;
};

// this is just one simple state...
export type GenericProfile = {
  name: string;
  id: string;
  state: Record<ChannelSimpleFunction, number>;
  // value: Record<ChannelSimpleFunction, string>;
  globals: Record<ChannelSimpleFunction, string>;

  // state: ProfileState;
  // states: ProfileState[];
};

export const ProfileContext = React.createContext<{
  profiles: GenericProfile[];
  updateProfile: (s: GenericProfile) => void;
  saveProfile: (s: GenericProfile) => void;
}>({
  profiles: [],
  updateProfile: () => {},
  saveProfile: () => {},
});

export const ProfileProvier = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<GenericProfile[]>([]);

  useEffect(() => {
    (async () => {
      const database = await getDatabase();
      const data = await database.getAll("genericProfiles");
      console.log("GOT Profiles", data);

      if (data.length > 0) setProfiles(data);
    })();
  }, []);

  const updateProfile = (profile: GenericProfile) => {
    setProfiles((state) => {
      const index = state.findIndex((v) => v.id === profile.id);
      if (index > -1) {
        state[index] = profile;
        return [...state];
      } else {
        return [...state, profile];
      }
    });
  };

  const saveProfile = async (profile: GenericProfile) => {
    console.log("SAVING", profile);
    const database = await getDatabase();

    database.put("genericProfiles", profile);

    setProfiles((state) => [...state, profile]);
  };

  return (
    <ProfileContext.Provider
      value={{
        saveProfile,
        profiles,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
