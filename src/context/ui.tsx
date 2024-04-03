import { create } from "zustand";

export const useUI = create<{
  venueEditMode: boolean;
  setVenueEditMode: (m: boolean) => void;
}>((set) => ({
  venueEditMode: false,
  setVenueEditMode: (venueEditMode: boolean) =>
    set((state) => ({
      ...state,
      venueEditMode,
    })),
}));
