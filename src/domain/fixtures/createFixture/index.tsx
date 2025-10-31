import { useEffect, useState } from "react";
import {
  Fixture,
  FixtureShape,
  SupportedFixtures,
} from "../../../context/fixtures";

import styles from "./createFixture.module.scss";
import { Channel, defaultValue } from "./channel";
import { FixtureComponent } from "../fixture";
import { Functions } from "./functions/functions";
import { ConnectedLight } from "../../../components/connectedLight";
import { DMXState } from "../../../context/dmx";

export const DEFAULT_DMX_UNIVERSE = 0;

const BASIC_FIXTURE = (): Fixture => ({
  type: SupportedFixtures.light,
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
  const [dmxValues, setDmxValues] = useState<Record<number, number>>({});
  const [dmxChannel, setDmxChannel] = useState<number>(1);

  useEffect(() => {
    Object.keys(dmxValues).forEach((key) => {
      DMXState[DEFAULT_DMX_UNIVERSE][parseInt(key) + dmxChannel - 1] =
        dmxValues[parseInt(key)];
    });
  }, [dmxValues, dmxChannel]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Create Fixture</div>
      <ConnectedLight
        fixture={fixture}
        venueFixture={{
          channel: dmxChannel,
          fixtureId: fixture.id,
          universe: 0,
          id: "TempFixture",
          x: 0,
          y: 0,
          overwrites: {},
          tags: [],
        }}
      >
        <FixtureComponent fixture={fixture} />
      </ConnectedLight>

      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="fixture_name">Name:</label>
            </td>
            <td>
              <input
                id="fixture_name"
                name="fixture_name"
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
              <label>Channel (Testing only):</label>
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
              <label htmlFor="fixture_channels">Channels:</label>
            </td>
            <td>
              <input
                type="number"
                id="fixture_channels"
                name="fixture_channels"
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
              <label htmlFor="fixture_shape">Shape:</label>
            </td>
            <td>
              <select
                id="fixture_shape"
                name="fixture_shape"
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
