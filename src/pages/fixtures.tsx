import ReactDOM from "react-dom/client";
import "../index.css";
import { Fixture, useFixtures } from "../context/fixtures.tsx";
import { VenueProvider } from "../context/venues.tsx";
import { MidiProvider } from "../context/midi.tsx";
import { useState } from "react";
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

createUniverses([DEFAULT_DMX_UNIVERSE]);

const FixturesPage = () => {
  const { fixtures, add, update, remove } = useFixtures();

  const [fixture, setFixture] = useState<Fixture>();

  return (
    <BasicPage
      headerRight={
        <>
          Connect DMX:
          <button
            onClick={async () => {
              const device = await registerUsbDevice();
              device && startUSBDMX(device, DEFAULT_DMX_UNIVERSE);
            }}
          >
            USB
          </button>
          <button
            onClick={async () => {
              const port = await registerSerialDevice();
              port && startSerialDMX(port, DEFAULT_DMX_UNIVERSE);
            }}
          >
            SERIAL
          </button>
        </>
      }
      left={
        <>
          <h2>Saved</h2>
          <ListWithAction
            items={fixtures.map((f) => ({ ...f, name: f.model }))}
            actions={[
              {
                name: "edit",
                onClick: setFixture,
              },
              {
                name: "remove",
                onClick: remove,
              },
            ]}
          />
        </>
      }
    >
      <CreateFixture
        fixture={fixture}
        onClose={() => setFixture(undefined)}
        onSubmit={(fixture) => {
          const existst = fixtures.find((f) => f.id == fixture.id);
          if (existst) {
            update({
              ...fixture,
            });
          } else {
            add({
              ...fixture,
              id: crypto.randomUUID(),
            });
          }
        }}
      />
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <VenueProvider>
      <FixturesPage />
    </VenueProvider>
  </MidiProvider>
  // </React.StrictMode>
);
