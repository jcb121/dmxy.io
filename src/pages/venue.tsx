import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { sampleVenue, useVenues, Venue } from "../context/venues";
import { useFixtures } from "../context/fixtures";
import { Fixtures } from "../domain/fixtures/list";
import { NewStage } from "../components/stage/new-stage";
import { useMemo, useState } from "react";
import { LockChannels } from "../components/lock-channels/lock-channels";
import { VenueFixtureComp } from "../domain/venue/create/fixture";
import { registerSerialDevice } from "../context/dmx/serial";
import { registerUsbDevice } from "../context/dmx/usb";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("venue_id");

const _venue =
  useVenues.getState().venues.find((v) => v.id === id) || sampleVenue();

const CreateVenue = () => {
  const [venue, setVenue] = useState<Venue>(_venue);

  // const venue = useVenue((state) => state.venue);
  const fixtures = useFixtures((s) => s.fixtures);
  const addVenue = useVenues((s) => s.add);
  const original = useVenues((state) =>
    state.venues.find((a) => a.id == venue.id)
  );

  const [activeVenueFixtureId, setActiveVenueFixtureId] = useState<string>();

  const activeVenueFixture = useMemo(() => {
    return venue.venueFixtures.find((vf) => vf.id === activeVenueFixtureId);
  }, [venue, activeVenueFixtureId]);

  const activeFixture = useMemo(() => {
    return fixtures.find((vf) => vf.id === activeVenueFixture?.fixtureId);
  }, [fixtures, activeVenueFixture]);

  const universes = venue.venueFixtures.reduce((universes, vf) => {
    if (universes.includes(vf.universe || 0)) {
      return universes;
    }
    return [...universes, vf.universe || 0];
  }, [] as number[]);

  return (
    <BasicPage
      header={
        <div>
          <input
            onChange={(e) => {
              setVenue((state) => ({
                ...state,
                name: e.target.value,
              }));
            }}
            value={venue.name}
          />
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              if (!urlParams.get("venue_id")) {
                urlParams.set("venue_id", venue.id);
                window.location.search = urlParams.toString();
              }
              addVenue(venue);
            }}
          >
            {original ? "Save" : "Save As"}
          </button>
        </div>
      }
      left={
        <>
          <Fixtures
            fixtures={fixtures}
            onDrag={(fixture, e) => {
              e.dataTransfer.setData("fixtureId", fixture.id);
              console.log("Settings", "fixtureId", fixture.id);
            }}
          />
          <h4>Universes</h4>
          {universes.map((universe) => (
            <div key={universe}>
              <h5>Universe {universe}:</h5>
              device: {venue.universes?.[universe]?.name || "NONE"}
              <button
                onClick={async () => {
                  try {
                    const port = await registerSerialDevice();
                    port &&
                      setVenue((state) => ({
                        ...state,
                        universes: {
                          ...state.universes,
                          [universe]: {
                            name: "Serial",
                            protocol: "SERIAL",
                            vendorId: port.getInfo().usbVendorId as number,
                          },
                        },
                      }));
                  } catch (e) {
                    // do nothing
                  }
                }}
              >
                Link to Serial
              </button>
              <button
                onClick={async () => {
                  try {
                    const device = await registerUsbDevice();
                    setVenue((state) => ({
                      ...state,
                      universes: {
                        ...state.universes,
                        [universe]: {
                          name: "uDMX",
                          protocol: "USB",
                          vendorId: device.vendorId,
                        },
                      },
                    }));
                  } catch (e) {
                    // do nothing
                  }
                }}
              >
                Link to USB
              </button>
            </div>
          ))}
        </>
      }
    >
      <NewStage
        onDrop={(e) => {
          const { top, left } = e.currentTarget.getBoundingClientRect();
          const fixtureId = e.dataTransfer.getData("fixtureId");
          if (fixtureId) {
            const fixture = fixtures.find((f) => f.id === fixtureId);
            if (!fixture) return;
            const id = crypto.randomUUID();
            setVenue({
              ...venue,
              venueFixtures: [
                ...venue.venueFixtures,
                {
                  overwrites: {},
                  tags: [],
                  channel: 1,
                  id,
                  fixtureId,
                  x: e.clientX - left,
                  y: e.clientY - top,
                },
              ],
            });
          }

          const id = e.dataTransfer.getData("id");
          if (id) {
            setVenue({
              ...venue,
              venueFixtures: venue.venueFixtures.map((f) =>
                f.id === id
                  ? { ...f, x: e.clientX - left, y: e.clientY - top }
                  : f
              ),
            });
          }
        }}
      >
        {venue.venueFixtures.map((venueFixture) => {
          return (
            <VenueFixtureComp
              setVenue={setVenue}
              setActiveVenueFixtureId={setActiveVenueFixtureId}
              venueFixture={venueFixture}
              activeVenueFixtureId={activeVenueFixtureId}
            />
          );
        })}
      </NewStage>

      {activeFixture && activeVenueFixture && (
        <LockChannels
          setVenue={setVenue}
          fixture={activeFixture}
          venueFixture={activeVenueFixture}
        />
      )}
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<CreateVenue />);
