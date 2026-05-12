import { Scene } from "../../../context/scenes";
import { ChannelSimpleFunction, Fixture } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";

import styles from "./styles.module.scss";
import { Frame } from "./frame";
import { Button } from "../../../ui/buttonLink";

// const fixtures = useFixtures((state) => state.fixtures);

// const venueFixtures = useMemo<VenueFixture[]>(() => {
//   if (!activeSelector) return [];
//   if (activeSelector === "*") {
//     return venue.venueFixtures;
//   }

//   const selectors = activeSelector.split(" ");

//   return venue.venueFixtures.reduce((venueFixtures, venueFixture) => {
//     const matches = selectors.every((activeSelector) => {
//       if (activeSelector[0] === "@") {
//         const id = activeSelector.slice(1);
//         return venueFixture.fixtureId === id;
//       }

//       if (activeSelector[0] === "#") {
//         const id = activeSelector.slice(1);
//         return venueFixture.id === id;
//       }
//       if (activeSelector[0] === ".") {
//         const tag = activeSelector.slice(1);
//         return venueFixture.tags.includes(tag);
//       }
//       return activeSelector === "*";
//     });
//     if (matches) {
//       return [...venueFixtures, venueFixture];
//     }
//     return venueFixtures;
//   }, [] as VenueFixture[]);
// }, [activeSelector, venue.venueFixtures]);

export const CreateRule = ({
  fixtures,
  new_profiles: _profiles,
  setProfiles,
  label,
}: {
  new_profiles?: Scene["new_profiles"][string];
  fixtures: Fixture[];
  label?: string;
  setProfiles: React.Dispatch<
    React.SetStateAction<Scene["new_profiles"][string]>
  >;
}) => {
  const functions = [
    ...new Set(
      fixtures.reduce((functions, fixture) => {
        if (fixture?.deviceFunctions) {
          return [...functions, ...fixture.deviceFunctions.map((f) => f.label)];
        }
        return functions;
      }, [] as string[]),
    ),
  ];

  const colourOptions = [
    ...new Set(
      fixtures.reduce((colourOptions, fixture) => {
        if (!fixture) {
          return functions;
        }

        return fixture.channelFunctions.reduce((colourOptions, channel) => {
          return channel.reduce((colourOptions, channelFunction) => {
            if (
              (channelFunction.function === ChannelSimpleFunction.fixedColour ||
                channelFunction.function === ChannelSimpleFunction.colour) &&
              channelFunction.value
            ) {
              return [...colourOptions, channelFunction.value];
            }

            return colourOptions;
          }, colourOptions);
        }, colourOptions);
      }, [] as string[]),
    ),
  ];

  const options = [
    ...new Set(
      fixtures?.reduce((options, fixture) => {
        if (!fixture) {
          return options;
        }

        return fixture.channelFunctions.reduce((options, channel) => {
          return channel.reduce((options, channelFunction) => {
            if (channelFunction.mapIntensity) {
              return [
                ...options,
                ChannelSimpleFunction.intensity,
                channelFunction.function,
              ];
            }

            if (
              channelFunction.function !== ChannelSimpleFunction.fixedColour &&
              channelFunction.function !== ChannelSimpleFunction.function
            ) {
              return [...options, channelFunction.function];
            }
            return options;
          }, options);
        }, options);
      }, [] as ChannelSimpleFunction[]),
    ),
  ];

  const defaultOptions: New_GenericProfile = {
    state: options.reduce(
      (init, option) => ({ ...init, [option]: 0 }),
      {} as Record<string, number>,
    ),
    globals: {},
  };

  const profiles =
    !_profiles || _profiles.length === 0 ? [defaultOptions] : _profiles;
  return (
    <div className={styles.root}>
      <table>
        {label && <caption>{label}</caption>}
        <thead>
          <tr>
            <th>Frame</th>
            <th>State</th>
            <th>Value</th>
            <th>Functions</th>
          </tr>
        </thead>
          {profiles?.map((frame, step) => {
            return (
              <Frame
                key={`${step}`}
                index={step}
                frame={frame}
                options={options}
                colourOptions={colourOptions}
                functions={functions}
                onDelete={() => {
                  setProfiles((state) => state.filter((_, i) => i !== step));
                }}
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
            );
          })}
      </table>
      <Button
        onClick={() => {
          setProfiles((profiles) => {
            if (profiles.length === 0) {
              return [defaultOptions, defaultOptions];
            } else {
              return [...profiles, defaultOptions];
            }
          });
        }}
        title="Add Frame"
      >
        Add Frame
      </Button>
    </div>
  );
};
