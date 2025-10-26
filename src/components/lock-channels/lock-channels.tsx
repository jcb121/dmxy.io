import { useState } from "react";
import { ChannelSimpleFunction, Fixture } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { Venue, VenueFixture } from "../../context/venues";
import { CreateGlobal } from "../../domain/globals/create";

export const LockChannels = ({
  fixture,
  venueFixture,
  setVenue,
}: {
  setVenue: React.Dispatch<React.SetStateAction<Venue>>;

  fixture: Fixture;
  venueFixture: VenueFixture;
}) => {
  const globals = useGlobals((state) => state.values);
  const [func, setFunction] = useState<ChannelSimpleFunction>();
  const [globalName, setGlobalName] = useState<string>();

  const functions = [
    ...new Set(
      fixture.channelFunctions.reduce((functions, channel) => {
        return channel.reduce((functions, func) => {
          return [...functions, func.function];
        }, functions);
      }, [] as ChannelSimpleFunction[])
    ),
  ];

  return (
    <div>
      <CreateGlobal />

      <p>Lock Function - this cannot be overwritten by a profile!</p>

      <div>
        <select
          onChange={(e) => {
            setFunction(e.target.value as ChannelSimpleFunction);
          }}
        >
          <option>none</option>

          {functions.map((func) => (
            <option key={func}>{func}</option>
          ))}
        </select>
        to global
        <select
          onChange={(e) => {
            setGlobalName(e.target.value);
          }}
        >
          <option>none</option>
          {Object.keys(globals).map((_func, index) => (
            <option key={index} value={_func}>
              {_func}
            </option>
          ))}
        </select>
        <button
          disabled={func === undefined || !globalName}
          onClick={() => {
            if (func === undefined || !globalName) return;
            setVenue((venue) => ({
              ...venue,
              venueFixtures: venue.venueFixtures.map((v) =>
                v.id === venueFixture.id
                  ? {
                      ...v,
                      overwrites: {
                        ...v.overwrites,
                        [func]: globalName,
                      },
                    }
                  : v
              ),
            }));
          }}
        >
          Add
        </button>
      </div>
      <div>
        {Object.keys(venueFixture.overwrites).map((key) => (
          <div key={key}>
            Channel {key} is locked to {venueFixture.overwrites[key as ChannelSimpleFunction]}
            <button
              onClick={() => {
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) => {
                    if (v.id === venueFixture.id) {
                      const overwrites = { ...v.overwrites };
                      delete overwrites[key as ChannelSimpleFunction];
                      return {
                        ...v,
                        overwrites,
                      };
                    }
                    return v;
                  }),
                }));
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
