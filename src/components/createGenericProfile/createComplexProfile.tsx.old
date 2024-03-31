import { useContext, useState } from "react";
// import { ChannelSimpleFunction } from "../../context/fixtures";
// import { ChannelSetting } from "../createFixtureProfile/channelSetting";
import { GenericProfile, ProfileContext } from "../../context/profiles";
// import { GenericLight } from "../generic-light";
import styles from "./createGenericProfile.module.scss";
import { ProfileState } from "./profile-state";
import { ChannelSimpleFunction } from "../../context/fixtures";

const defaultState = () => ({
  id: crypto.randomUUID(),
  value: {} as Record<ChannelSimpleFunction, string>,
  state: Object.values(ChannelSimpleFunction).reduce((prof, name) => {
    if (name) prof[name] = 0;
    return prof;
  }, {} as Record<ChannelSimpleFunction, number>),
});

export const CreateComplexGenericProfile = () => {
  const { saveProfile, profiles } = useContext(ProfileContext);

  const [profile, setProfile] = useState<Omit<GenericProfile, "id">>({
    name: "",
    states: [defaultState()],
  });

  const saveProfileClick = () => {
    // console.log(profile);
    saveProfile({
      ...profile,
      id: crypto.randomUUID(),
    });
  };

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

        {/* <input
          className={styles.input}
          placeholder="Hold time"
          value={profile.hold}
          onChange={(e) => {
            setProfile((state) => ({
              ...state,
              hold: parseInt(e.target.value),
            }));
          }}
        /> */}

        {/* <input
          className={styles.input}
          placeholder="Fade in"
          value={profile.fadeIn}
          onChange={(e) => {
            setProfile((state) => ({
              ...state,
              fadeIn: parseInt(e.target.value),
            }));
          }}
        /> */}

        {/* <input
          className={styles.input}
          placeholder="Fade out"
          value={profile.fadeOut}
          onChange={(e) => {
            setProfile((state) => ({
              ...state,
              fadeOut: parseInt(e.target.value),
            }));
          }}
        /> */}

        <div className={styles.spacer}></div>

        <button className={styles.save} onClick={saveProfileClick}>
          Save
        </button>
      </div>

      {/* <GenericLight profile={profile} /> */}

      <div className={styles.legs}>
        {/* {profile.states.map((state, index) => (
          <div key={state.id} className={styles.leg}>
            <ProfileState
              title={`Step ${index + 1}`}
              removeStep={(profileState) => {
                setProfile((state) => ({
                  ...state,
                  states: state.states.filter((s) => s.id !== profileState.id),
                }));
              }}
              value={state}
              onChange={(profileState) => {
                setProfile((state) => ({
                  ...state,
                  states: state.states.map((s) =>
                    s.id === profileState.id ? profileState : s
                  ),
                }));
              }}
            />
          </div>
        ))} */}
        <div className={styles.leg}>
          {/* <button
            onClick={() => {
              setProfile((state) => ({
                ...state,
                states: [...state.states, defaultState()],
              }));
            }}
          >
            Add Step
          </button> */}
{/*
          <div
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              const profileId = e.dataTransfer.getData("profileId");
              const profile = profiles.find((f) => f.id === profileId);

              if (!profile) return;
              setProfile((state) => ({
                ...state,
                states: [...state.states, ...profile.states],
              }));
            }}
            className={styles.dropArea}
          >
            Or Drop here
          </div> */}
        </div>
      </div>
    </div>
  );
};
