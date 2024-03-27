import { ChannelSimpleFunction } from "../../context/fixtures";
import { ProfileState as ProfileStateType } from "../../context/profiles";
import styles from "./profile-state.module.scss";
import { ChannelSetting } from "../createFixtureProfile/channelSetting";

export const ProfileState = ({
  // onSubmit,
  onChange,
  removeStep,
  value: profile,
  title,
}: {
  title?: string;
  onChange: (a: ProfileStateType) => void;
  removeStep: (a: ProfileStateType) => void;

  value: ProfileStateType;
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div>{title}</div>
        {removeStep && (
          <button
            onClick={() => {
              removeStep(profile);
            }}
          >
            X
          </button>
        )}
        {/* <button onClick={submit}>{value ? "update" : "add"}</button> */}
      </div>
      {/* <GenericLight profile={{}} /> */}
      {Object.values(ChannelSimpleFunction).map((funcName) => {
        if (!funcName) return null;
        return (
          <div key={funcName}>
            <table>
              <tbody>
                <ChannelSetting
                  onChange={(value) => {
                    onChange({
                      ...profile,
                      state: {
                        ...profile.state,
                        [funcName]: value,
                      },
                    });
                  }}
                  labelValue={profile.value[funcName]}
                  onLabelChange={(value) => {
                    onChange({
                      ...profile,
                      value: {
                        ...profile.value,
                        [funcName]: value,
                      },
                    });
                  }}
                  // data={profile.s[funcName]}
                  channelValue={profile.state[funcName]}
                  channel={{
                    0: {
                      range: [0, 255],
                      function: funcName,
                      value: profile.value[funcName],
                    },
                  }}
                />
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
