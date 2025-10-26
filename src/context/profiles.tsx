import { useEffect, useState } from "react";
import { ChannelSimpleFunction } from "./fixtures";
import { getDatabase } from "../db";
import React from "react";
import { Colours } from "../colours";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRGB } from "../utils/rgb";

export type ProfileState = Record<ChannelSimpleFunction, number>;
// this is just one simple state...
// better to have a target value...
export type GenericProfile = {
  name: string;
  id: string;
  state: Partial<ProfileState>;
  // value: Record<ChannelSimpleFunction, string>;
  globals: Partial<Record<ChannelSimpleFunction, string>>;
};

export type New_GenericProfile = {
  state: Partial<ProfileState>;
  targetFunction?: string;
  // value: Record<ChannelSimpleFunction, string>;
  globals: Partial<Record<ChannelSimpleFunction, string>>; // this is useless
};

const globalColurs: GenericProfile[] = Object.keys(Colours).map((name) => {
  const [Red, Green, Blue] = getRGB(Colours[name as keyof typeof Colours]);

  return {
    name,
    id: `global_${name}`,
    globals: {
      Intensity: "Intensity",
      Strobe: "Strobe",
    },
    state: {
      Red,
      Green,
      Blue,
      // White: 0,
    },
  } satisfies GenericProfile;
});

// console.log(globalColurs);

export const ProfileContext = React.createContext<{
  profiles: GenericProfile[];
  updateProfile: (s: GenericProfile) => void;
  saveProfile: (s: GenericProfile) => void;
  reloadProfiles: () => void;
}>({
  profiles: [],
  updateProfile: () => {},
  saveProfile: () => {},
  reloadProfiles: () => {},
});

export const useProfiles = create<{
  profiles: GenericProfile[];
  add: (p: GenericProfile) => void;
  remove: (p: GenericProfile) => void;
}>()(
  persist(
    (set) => {
      return {
        add: (p: GenericProfile) => {
          set((state) => ({
            ...state,
            profiles: [...state.profiles, p],
          }));
        },
        remove: (profile) => {
          set((state) => ({
            ...state,
            profiles: state.profiles.filter((f) => f.id !== profile.id),
          }));
        },
        profiles: [],
      };
    },
    { name: "profiles" }
  )
);

export const ProfileProvier = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<GenericProfile[]>(globalColurs);

  useEffect(() => {
    reloadProfiles();
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

  const reloadProfiles = async () => {
    const database = await getDatabase();
    const data = await database.getAll("genericProfiles");

    if (data.length > 0) setProfiles([...globalColurs, ...data]);
  };

  return (
    <ProfileContext.Provider
      value={{
        reloadProfiles,
        saveProfile,
        profiles,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
