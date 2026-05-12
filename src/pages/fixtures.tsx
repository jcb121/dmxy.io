import ReactDOM from "react-dom/client";
import "../index.css";
import { useFixtures } from "../context/fixtures.tsx";
import { MidiProvider } from "../context/midi.tsx";
import {
  CreateFixture,
  DEFAULT_DMX_UNIVERSE,
} from "../domain/fixtures/createFixture/index.tsx";
import { BasicPage } from "../ui/layout/basic-page.tsx";
import { ListWithAction } from "../ui/list-with-actions/index.tsx";
import {
  registerSerialDevice,
  startDMX as startSerialDMX,
} from "../context/dmx/serial.ts";
import {
  registerUsbDevice,
  startDMX as startUSBDMX,
} from "../context/dmx/usb.ts";
import { createUniverses } from "../context/dmx/index.ts";
import { Button } from "../ui/buttonLink/index.tsx";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { z } from "zod";

createUniverses([DEFAULT_DMX_UNIVERSE]);

const FixturesPage = () => {
  const { fixtures, add, update, remove } = useFixtures();

  const { fixtureId } = useSearch({ from: "/fixtures.html" });
  const navigate = useNavigate({ from: "/fixtures.html" });
  const fixture = fixtures.find((f) => f.id === fixtureId);

  const setFixtureId = (id: string | undefined) =>
    navigate({ search: (prev: { fixtureId?: string }) => ({ ...prev, fixtureId: id }) });

  return (
    <BasicPage
      header={<h2>Fixtures</h2>}
      back="/"
      headerRight={
        <>
          Connect DMX:
          <Button
            onClick={async () => {
              const device = await registerUsbDevice();
              device && startUSBDMX(device, DEFAULT_DMX_UNIVERSE);
            }}
          >
            USB
          </Button>
          <Button
            onClick={async () => {
              const port = await registerSerialDevice();
              port && startSerialDMX(port, DEFAULT_DMX_UNIVERSE);
            }}
          >
            SERIAL
          </Button>
        </>
      }
      left={
        <>
          <ListWithAction
            items={fixtures.map((f) => ({ ...f, name: f.model }))}
            onClick={(f) => setFixtureId(f.id)}
            actions={[
              {
                name: "🗑",
                onClick: remove,
              },
            ]}
          />
        </>
      }
    >
      <CreateFixture
        fixture={fixture}
        onClose={() => setFixtureId(undefined)}
        onSubmit={(f) => {
          if (f.id) {
            update({ ...f, id: f.id });
          } else {
            const id = crypto.randomUUID();
            add({ ...f, id });
            setFixtureId(id);
          }
        }}
      />
    </BasicPage>
  );
};

const itemSearchSchema = z.object({
  fixtureId: z.string().optional(),
});

export const rootRoute = createRootRoute();
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fixtures.html",
  validateSearch: (search) => itemSearchSchema.parse(search), // Validation!
  component: FixturesPage,
});
const routeTree = rootRoute.addChildren([indexRoute]);
export const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <RouterProvider router={router} />
  </MidiProvider>,
  // </React.StrictMode>
);
