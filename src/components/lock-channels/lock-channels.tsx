import { useState } from "react";
import { Fixture } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { Venue, VenueFixture } from "../../context/venues";

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
  const [channelIndex, setChannelIndex] = useState<number>();
  const [globalName, setGlobalName] = useState<string>();

  // TODO: don't allow the same
  // const channelOptions = fixture.channelFunctions.filter((_c, index) => {
  //   return venueFixture.overwrites[index];
  // });

  return (
    <div>
      <p>LockChannel</p>
      <div>
        <select
          onChange={(e) => {
            setChannelIndex(parseInt(e.target.value));
          }}
        >
          <option>none</option>
          {fixture.channelFunctions.map((_func, index) => (
            <option key={index} value={index}>
              {`(${index})`}
              {_func
                .map((f) => f.function)
                .join(",")
                .substring(0, 10)}
            </option>
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
          disabled={channelIndex === undefined || !globalName}
          onClick={() => {
            if (channelIndex === undefined || !globalName) return;
            setVenue((venue) => ({
              ...venue,
              venueFixtures: venue.venueFixtures.map((v) =>
                v.id === venueFixture.id
                  ? {
                      ...v,
                      overwrites: {
                        ...v.overwrites,
                        [channelIndex]: globalName,
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
            Channel {key} is locked to {venueFixture.overwrites[key as number]}
            <button
              onClick={() => {
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) => {
                    if (v.id === venueFixture.id) {
                      const overwrites = { ...v.overwrites };
                      delete overwrites[key as number];
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
