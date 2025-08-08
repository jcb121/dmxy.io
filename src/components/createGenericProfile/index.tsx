import { useMemo } from "react";
import {
  GenericProfile,
  ProfileState,
  useProfiles,
} from "../../context/profiles";
import { ChannelSimpleFunction, useFixtures } from "../../context/fixtures";
import styles from "./createGenericProfile.module.scss";
import { useGlobals } from "../../context/globals";
import { getRGB } from "../../utils";

export const defaultState = (globals: string[]): GenericProfile => ({
  name: "",
  id: crypto.randomUUID(),
  // value: {} as Record<ChannelSimpleFunction, string>,
  state: Object.values(ChannelSimpleFunction).reduce((prof, name) => {
    if (name) prof[name] = 0;
    return prof;
  }, {} as ProfileState),
  globals: Object.values(ChannelSimpleFunction).reduce((prof, name) => {
    if (globals.includes(name)) {
      prof[name] = name;
    }
    return prof;
  }, {} as Record<string, string>),
});

export const CreateGenericProfile = ({
  profile,
  setProfile,
}: {
  profile: GenericProfile;
  setProfile: React.Dispatch<React.SetStateAction<GenericProfile>>;
}) => {
  const fixture = useFixtures((state) => state.fixtures);

  const colourOptions = useMemo(() => {
    return fixture.reduce((colours, fixture) => {
      return fixture.channelFunctions.reduce((_colours, channelFunctions) => {
        return channelFunctions.reduce((__colours, func) => {
          if (
            func.function === ChannelSimpleFunction.fixedColour &&
            func.value
          ) {
            return [...__colours, func.value];
          }

          return __colours;
        }, _colours);
      }, colours);
    }, [] as string[]);
  }, [fixture]);

  const saveProfile = useProfiles((state) => state.add);
  const globalValues = useGlobals((state) => state.values);

  const saveProfileClick = () => {
    saveProfile(profile);
    setProfile(defaultState(Object.keys(globalValues)));
  };

  // const globalOptions = Object.keys(globalValues).filter(
  //   (k) => globalValues[k].type === GlobalTypes.byte
  // );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>Profile</div>
        <div className={styles.create}>
          <div className={styles.label}>Create Profile:</div>

          <input
            className={styles.input}
            value={profile.name}
            onChange={(e) => {
              setProfile((state) => ({ ...state, name: e.target.value }));
            }}
          />
          {/* <input
            className={styles.input}
            size={9}
            style={{
              borderStyle: "solid",
              // borderColor: `#${value}`,
            }}
            // value={globalValue || value || ""}
            onChange={() => {
              // setProfile((state) => ({
              //   ...state,
              //   value: {
              //     ...state.value,
              //     [functionName]: e.target.value,
              //   },
              // }));
            }}
            type="text"
            // placeholder={functionName}
          /> */}

          <button className={styles.button} onClick={saveProfileClick}>
            Save
          </button>
        </div>
      </div>
      <div>
        {colourOptions.map((colour) => (
          <button
            style={{
              background: `#${colour}`,
            }}
            key={colour}
            onClick={() => {
              const [Red, Green, Blue] = getRGB(colour);
              setProfile((profile) => ({
                ...profile,
                state: {
                  ...profile.state,
                  Red,
                  Green,
                  Blue,
                },
              }));
            }}
          >
            #{colour}
          </button>
        ))}
      </div>
      <div>
        {/* <ProfileState
          // title={`Step ${index + 1}`}
          // removeStep={(profileState) => {
          //   setProfile(profileState);
          //   // setProfile((state) => ({
          //   //   ...state,
          //   //   states: state.states.filter((s) => s.id !== profileState.id),
          //   // }));
          // }}
          value={profile}
          onChange={(profileState) => {
            setProfile(profileState);

            // setProfile((state) => ({
            //   ...state,
            //   states: state.states.map((s) =>
            //     s.id === profileState.id ? profileState : s
            //   ),
            // }));
          }}
        /> */}
        <table>
          <tbody>
            {Object.keys(profile.state).map((_funcName) => {
              const functionName = _funcName as ChannelSimpleFunction;

              const state = profile.state[functionName];
              // const value = profile.value[functionName];
              const global = profile.globals[functionName];
              const globalValue = global && globalValues[global]?.value;

              return (
                <tr key={functionName}>
                  <td>{functionName}</td>
                  <td>
                    <input
                      disabled={!!global}
                      type="range"
                      min={0}
                      max={255}
                      step="1"
                      value={global ? globalValue : state}
                      onChange={(e) => {
                        setProfile((state) => ({
                          ...state,
                          state: {
                            ...state.state,
                            [functionName]: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      disabled={!!global}
                      size={3}
                      type="number"
                      min="0"
                      max="255"
                      step="1"
                      value={global ? globalValue : state}
                      onChange={(e) => {
                        setProfile((state) => ({
                          ...state,
                          state: {
                            ...state.state,
                            [functionName]: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />
                  </td>
                  <td>
                    Global:
                    <select
                      value={global}
                      onChange={(e) => {
                        // if (functionName === ChannelSimpleFunction.colour) {
                        setProfile((state) => ({
                          ...state,
                          globals: {
                            ...state.globals,
                            [functionName]: e.target.value,
                          },
                        }));
                        // } else {
                        // setProfile((state) => ({
                        //   ...state,
                        //   globals: {
                        //     ...state.globals,
                        //     [functionName]: parseInt(e.target.value),
                        //   },
                        // }));
                        // }
                      }}
                    >
                      <option></option>
                      {Object.keys(globalValues).map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
