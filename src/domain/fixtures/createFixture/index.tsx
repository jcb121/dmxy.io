import { useEffect, useState } from "react";
import {
  Fixture,
  FixtureShape,
  // useFixtures,
  // ChannelFunctions,
  // ColourMode,
  // ColourMode,
} from "../../../context/fixtures";

import styles from "./createFixture.module.scss";
// import { FunctionSelect } from "./function-select";
// import { connect } from "../../../dmx";
// import { LightMode } from "./light-mode";
import { Channel, defaultValue } from "./channel";
// import { Light } from "../../../components/light";
// import { Fixture } from "../list/fixture";
import { FixtureComponent } from "../fixture";
import { DMXState } from "../../../dmx";
import { Functions } from "./functions/functions";

const BASIC_FIXTURE = (): Fixture => ({
  id: crypto.randomUUID(),
  model: "",
  channelFunctions: [],
  fixtureShape: FixtureShape.square,
});

export const CreateFixture = ({
  fixture: _fixture,
  onSubmit,
  onClose,
}: {
  fixture?: Fixture;
  onSubmit: (fixture: Fixture) => void;
  onClose: () => void;
}) => {
  const [fixture, setFixture] = useState<Fixture>(_fixture || BASIC_FIXTURE());
  useEffect(() => {
    setFixture(_fixture || BASIC_FIXTURE());
  }, [_fixture]);
  const original = !_fixture;

  // const [model, setModel] = useState<string>("");
  // const [channels, setChannels] = useState<number>(1);
  // const [fixtureShape, setFixtureShape] = useState<FixtureShape>(
  //   FixtureShape.circle
  // );
  // const [channels, setChannels] = useState<ChannelFunctions>([[defaultValue]]);
  // const [colourMode, setColourMode] = useState<ColourMode>(ColourMode.fixed);
  // const [colour, setColour] = useState<string>();

  const [dmxValues, setDmxValues] = useState<Record<number, number>>({});
  const [dmxChannel, setDmxChannel] = useState<number>(1);

  useEffect(() => {
    Object.keys(dmxValues).forEach((key) => {
      DMXState[parseInt(key) + dmxChannel] = dmxValues[parseInt(key)];
    });
  }, [dmxValues, dmxChannel]);

  // useEffect(() => {
  //   port && sendUniverse(port, dmxValues);
  // }, [port, dmxValues]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Create Fixture</div>

      <FixtureComponent dmxValues={dmxValues} fixture={fixture} />

      <table>
        <tbody>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input
                value={fixture.model}
                onChange={(e) =>
                  setFixture((state) => ({
                    ...state,
                    model: e.target.value,
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Channel:</label>
            </td>
            <td>
              <input
                type="number"
                value={dmxChannel}
                onChange={(e) => setDmxChannel(parseInt(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Channels:</label>
            </td>
            <td>
              <input
                type="number"
                value={fixture.channelFunctions.length}
                onChange={(e) => {
                  const target = parseInt(e.target.value);

                  if (fixture.channelFunctions.length < target) {
                    setFixture((state) => {
                      while (state.channelFunctions.length < target) {
                        state.channelFunctions.push([defaultValue]);
                      }
                      return {
                        ...state,
                        channelFunctions: [...state.channelFunctions],
                      };
                    });
                  } else if (fixture.channelFunctions.length > target) {
                    setFixture((state) => {
                      return {
                        ...state,
                        channelFunctions: state.channelFunctions.slice(
                          0,
                          target
                        ),
                      };
                    });
                  }
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Shape:</label>
            </td>
            <td>
              <select
                value={fixture.fixtureShape}
                onChange={(e) => {
                  setFixture((state) => ({
                    ...state,
                    fixtureShape: e.target.value as FixtureShape,
                  }));
                }}
              >
                {Object.values(FixtureShape).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {/* <tr>
            <td>
              <label>Color:</label>
            </td>
            <td>
              <LightMode
                colourMode={colourMode}
                setColourMode={setColourMode}
                setColour={setColour}
                colour={colour}
              />
            </td>
          </tr> */}
          {fixture.channelFunctions.map((channel, i) => {
            return (
              <Channel
                key={i}
                setDmxValues={setDmxValues}
                index={i}
                dmxValues={dmxValues}
                channelFunction={channel}
                onChange={(c) => {
                  setFixture((state) => ({
                    ...state,
                    channelFunctions: state.channelFunctions.map((s, index) =>
                      index == i ? c : s
                    ),
                  }));
                }}
              />
            );
          })}
        </tbody>
      </table>

      <Functions
        channels={fixture.channelFunctions}
        functions={fixture.deviceFunctions}
        setFunctions={(action) => {
          if (typeof action === "function") {
            setFixture((state) => ({
              ...state,
              deviceFunctions: action(state.deviceFunctions),
            }));
          } else {
            setFixture((state) => ({
              ...state,
              deviceFunctions: action,
            }));
          }
        }}
      />
      {original ? (
        <>
          <button onClick={() => onSubmit(fixture)}>Save As</button>
        </>
      ) : (
        <>
          <button onClick={() => onClose()}>close</button>
          <button onClick={() => onSubmit(fixture)}>Save</button>
        </>
      )}
    </div>
  );
};
