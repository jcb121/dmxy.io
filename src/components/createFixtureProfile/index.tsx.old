import { useContext, useState } from "react";
import { DMXValues, Fixture, FixtureContext } from "../../context/fixtures";
import styles from "./styles.module.scss";
import { Light } from "../light";
import { ChannelSetting } from "./channelSetting";

export const CreateFixtureProfile = ({ fixture }: { fixture: Fixture }) => {
  const { saveFixtureProfile } = useContext(FixtureContext);
  const [name, setName] = useState<string>();
  const [dmxValues, setDmxValues] = useState<DMXValues>(
    Object.keys(fixture.channelFunctions).reduce((all, _, index) => {
      return {
        ...all,
        [index]: 0,
      };
    }, {})
  );

  const onSave = () => {
    if (!name) return;
    saveFixtureProfile({
      fixtureId: fixture.id,
      id: crypto.randomUUID(),
      name,
      dmxValues,
    });
    // return to defaults..
    setName("");
    setDmxValues(
      Object.keys(fixture.channelFunctions).reduce((all, _, index) => {
        return {
          ...all,
          [index]: 0,
        };
      }, {})
    );
  };
  return (
    <div className={styles.root}>
      <div>Create Profile</div>

      <div className={styles.name}>
        <Light fixture={fixture} dmxValues={dmxValues} />

        <label className={styles.label}>
          <input
            className={styles.name}
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button onClick={onSave}>Save</button>
      </div>

      <table>
        <tbody>
          {Object.keys(fixture.channelFunctions).map((channelIndex) => {
            const channel = fixture.channelFunctions[parseInt(channelIndex)];

            const channelValue = dmxValues[parseInt(channelIndex)];
            return (
              <>
                <tr>
                  <th colSpan={2}>
                    Channel {channelIndex}
                    <input
                      type="number"
                      min="0"
                      max="255"
                      step="1"
                      value={channelValue}
                      onChange={(e) => {
                        setDmxValues((state) => {
                          return {
                            ...state,
                            [channelIndex]: e.target.value,
                          };
                        });
                      }}
                    />
                  </th>
                </tr>

                <ChannelSetting
                  onChange={(val) => {
                    setDmxValues((state) => {
                      return {
                        ...state,
                        [channelIndex]: val,
                      };
                    });
                  }}
                  channelValue={channelValue}
                  channel={channel}
                />
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
