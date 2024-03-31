import { useContext, useState } from "react";
import { GenericProfile, ProfileContext } from "../../context/profiles";
import { ChannelSimpleFunction } from "../../context/fixtures";
import styles from "./createGenericProfile.module.scss";
import { useGlobals } from "../../context/globals";

const defaultState = (globals: string[]): GenericProfile => ({
  name: "",
  id: crypto.randomUUID(),
  // value: {} as Record<ChannelSimpleFunction, string>,
  state: Object.values(ChannelSimpleFunction).reduce((prof, name) => {
    if (name) prof[name] = 0;
    return prof;
  }, {} as Record<string, number>),
  globals: Object.values(ChannelSimpleFunction).reduce((prof, name) => {
    if (globals.includes(name)) {
      prof[name] = name;
    }
    return prof;
  }, {} as Record<string, string>),
});

export const CreateGenericProfile = () => {
  const { saveProfile } = useContext(ProfileContext);
  const globalValues = useGlobals((state) => state.values);
  const [profile, setProfile] = useState<GenericProfile>(
    defaultState(Object.keys(globalValues))
  );

  const saveProfileClick = () => {
    saveProfile(profile);
    setProfile(defaultState(Object.keys(globalValues)));
  };

  // const globalOptions = Object.keys(globalValues).filter(
  //   (k) => globalValues[k].type === GlobalTypes.byte
  // );

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <input
          className={styles.input}
          placeholder="Profile name"
          value={profile.name}
          onChange={(e) => {
            setProfile((state) => ({ ...state, name: e.target.value }));
          }}
        />
        <div className={styles.spacer}></div>

        <button className={styles.save} onClick={saveProfileClick}>
          Save
        </button>
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
            <tr>
              <td>Target colour</td>
              <td>
                <input
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
                />
              </td>
            </tr>

            {Object.keys(profile.state).map((_funcName) => {
              const functionName = _funcName as ChannelSimpleFunction;

              const state = profile.state[functionName];
              // const value = profile.value[functionName];
              const global = profile.globals[functionName];
              const globalValue = globalValues[global]?.value;

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
