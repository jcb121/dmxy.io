import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MidiProvider } from "./context/midi.tsx";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  venue_id: z.string().optional(),
  stageWidth: z.number().optional(),
  stageHeight: z.number().optional(),
});

const rootRoute = createRootRoute();
const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/main.html",
  validateSearch: (search) => searchSchema.parse(search),
  component: App,
});

const routeTree = rootRoute.addChildren([mainRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MidiProvider>
    <RouterProvider router={router} />
  </MidiProvider>,
);
