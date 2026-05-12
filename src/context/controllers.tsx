import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LPD8, MPD218 } from "../components/controller/controller-json";
import { Layout } from "../components/controller/layout/layout";



export type Controller = { name: string; id: string; layout: Layout };

export type TempController = Omit<Controller, "id"> & { id?: string; };

export const SAMPLE_CONTROLLER: () => TempController = () => ({
  name: "",
  layout: {
    children: [],
    type: "row"
  }
})

export const useControllers = create<{
  controllers: Controller[];
}>()(
  persist(
    (_set) => {
      return {
        controllers: [
          { name: "AKAI LPD8", id: "AKAI_LPD8", layout: LPD8 },
          { name: "AKAI MPD218", id: "AKAI_MPD218", layout: MPD218 },
        ],
      };
    },
    {
      name: "controllers",
    },
  ),
);

export const useActiveControllers = create<{
  [venueId: string]: string[];
}>()(
  persist(
    (_set) => {
      return {};
    },
    {
      name: "active-controllers",
    },
  ),
);
