import { useMemo } from "react";
import { Venue, VenueFixture } from "../../../context/venues";
import { Scene } from "../../../context/scenes";
import { ChannelSimpleFunction, useFixtures } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";

import styles from "./styles.module.scss";
import { Frame } from "./frame";

export const CreateRule = ({
  venue,
  new_profiles: _profiles,
  activeSelector,
  setProfiles,
}: {
  activeSelector: string;
  new_profiles?: Scene["new_profiles"][string];
  venue: Venue;
  setProfiles: React.Dispatch<
    React.SetStateAction<Scene["new_profiles"][string]>
  >;
}) => {
  const venueFixtures = useMemo<VenueFixture[]>(() => {
    if (!activeSelector) return [];

    if (activeSelector === "*") {
      return venue.venueFixtures;
    }

    if (activeSelector[0] === "@") {
      const id = activeSelector.slice(1);
      return venue.venueFixtures.filter((vf) => vf.fixtureId === id);
    }

    if (activeSelector[0] === "#") {
      // specific device here
      const id = activeSelector.slice(1);
      const fixutre = venue.venueFixtures.find((vf) => vf.id === id);
      return fixutre ? [fixutre] : [];
    } else if (activeSelector[0] === ".") {
      const tag = activeSelector.slice(1);
      return venue.venueFixtures.filter((vf) => vf.tags.includes(tag));
    }

    return [];
  }, [activeSelector, venue.venueFixtures]);

  const fixtures = useFixtures((state) => state.fixtures);

  const functions = [
    ...new Set(
      venueFixtures.reduce((functions, vFixture) => {
        const fixture = fixtures.find((f) => f.id === vFixture.fixtureId);
        if (fixture?.deviceFunctions) {
          return [...functions, ...fixture.deviceFunctions.map((f) => f.label)];
        }
        return functions;
      }, [] as string[])
    ),
  ];

  const colourOptions = [
    ...new Set(
      venueFixtures.reduce((colourOptions, vFixture) => {
        const fixture = fixtures.find((f) => f.id === vFixture.fixtureId);

        if (!fixture) {
          return functions;
        }

        return fixture.channelFunctions.reduce((colourOptions, channel) => {
          return channel.reduce((colourOptions, channelFunction) => {
            if (
              channelFunction.function === ChannelSimpleFunction.fixedColour &&
              channelFunction.value
            ) {
              return [...colourOptions, channelFunction.value];
            }

            return colourOptions;
          }, colourOptions);
        }, colourOptions);
      }, [] as string[])
    ),
  ];

  const options = [
    ...new Set(
      venueFixtures?.reduce((options, vFixture) => {
        const fixture = fixtures.find((f) => f.id === vFixture.fixtureId);
        if (!fixture) {
          return options;
        }

        return fixture.channelFunctions.reduce((options, channel) => {
          return channel.reduce((options, channelFunction) => {
            if (
              channelFunction.function !== ChannelSimpleFunction.fixedColour &&
              channelFunction.function !== ChannelSimpleFunction.function
            ) {
              return [...options, channelFunction.function];
            }
            return options;
          }, options);
        }, options);
      }, [] as ChannelSimpleFunction[])
    ),
  ];

  const defaultOptions: New_GenericProfile = {
    state: options.reduce(
      (init, option) => ({ ...init, [option]: 0 }),
      {} as Record<string, number>
    ),
    globals: {},
  };

  const profiles =
    !_profiles || _profiles.length === 0 ? [defaultOptions] : _profiles;
  return (
    <div className={styles.root}>
      <div>
        <strong>{activeSelector}</strong>
      </div>

      <div className={styles.row}>
        {profiles?.map((frame, step) => {
          return (
            <div key={`${step}`} className={styles.frame}>
              {profiles.length > 1 && (
                <div className={styles.header}>
                  <div className={styles.text}>Frame {step + 1}</div>
                  <button
                    className={styles.delete}
                    disabled={profiles.length < 2}
                    onClick={() => {
                      setProfiles((profiles) => {
                        profiles.splice(step, 1);
                        return [...profiles];
                      });
                    }}
                  >
                    🗑
                  </button>
                </div>
              )}

              <Frame
                frame={frame}
                options={options}
                colourOptions={colourOptions}
                functions={functions}
                setFrame={(action) => {
                  setProfiles((state) => {
                    if (state.length === 0) {
                      return [
                        typeof action === "function"
                          ? action(defaultOptions)
                          : action,
                      ];
                    }
                    state[step] =
                      typeof action === "function"
                        ? action(state[step])
                        : action;
                    return [...state];
                  });
                }}
              />
            </div>
          );
        })}
        <div>
          <button
            className={styles.addFrame}
            onClick={() => {
              setProfiles((profiles) => {
                if (profiles.length === 0) {
                  return [defaultOptions, defaultOptions];
                } else {
                  return [...profiles, defaultOptions];
                }
              });
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
