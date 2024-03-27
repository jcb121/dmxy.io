import { useState } from "react";
import {
  Fixture,
  FixtureShape,
  ChannelFunctions,
  ColourMode,
} from "../../context/fixtures";

import styles from "./createFixture.module.scss";
import { FunctionSelect } from "./function-select";
import { connect, sendState } from "../../dmx";

export const CreateFixture = ({
  onSubmit,
}: {
  onSubmit: (a: Fixture) => void;
}) => {
  const [model, setModel] = useState<string>("");
  const [channels, setChannels] = useState<number>(0);
  const [fixtureShape, setFixtureShape] = useState<FixtureShape>(
    FixtureShape.circle
  );
  const [channelFunctions, setChannelFunctions] = useState<ChannelFunctions>(
    {}
  );
  const [colourMode, setColourMode] = useState<ColourMode>(ColourMode.fixed);
  const [colour, setColour] = useState<string>();

  const [dmxValues, setDmxValues] = useState<Record<number, number>>({});

  const [port, setPort] = useState<SerialPort>();

  // useEffect(() => {
  //   port && sendState(port, dmxValues);
  // }, [port, dmxValues]);

  const _onSave = () => {
    console.log(channelFunctions);

    // if (model && channels)
    onSubmit({
      id: crypto.randomUUID(),
      model,
      channels,
      channelFunctions: channelFunctions,
      fixtureShape,
      colourMode,
      colour: colourMode === ColourMode.single ? colour : undefined,
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.title}>Create Fixture</div>
      <button
        onClick={async () => {
          const port = await connect();
          setPort(port);
        }}
      >
        Live Preview
      </button>
      <button
        onClick={() => {
          console.log(port);
          port && sendState(port, dmxValues);
        }}
      >
        send
      </button>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Name:</label>
            </td>
            <td>
              <input value={model} onChange={(e) => setModel(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>
              <label>Channels:</label>
            </td>
            <td>
              <input
                type="number"
                value={channels}
                onChange={(e) => setChannels(parseInt(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Shape:</label>
            </td>
            <td>
              <select
                value={fixtureShape}
                onChange={(e) => {
                  setFixtureShape(e.target.value as FixtureShape);
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
          <tr>
            <td>
              <label>Color:</label>
            </td>
            <td>
              <label>
                <input
                  type="radio"
                  name="rgba"
                  checked={ColourMode.fixed == colourMode}
                  onChange={(e) => {
                    e.target.checked && setColourMode(ColourMode.fixed);
                  }}
                />
                Fixed
              </label>
              <label>
                <input
                  type="radio"
                  name="rgba"
                  checked={ColourMode.rgb == colourMode}
                  onChange={(e) => {
                    e.target.checked && setColourMode(ColourMode.rgb);
                  }}
                />
                RGB
              </label>
              <label>
                <input
                  type="radio"
                  name="rgba"
                  checked={ColourMode.rgba == colourMode}
                  onChange={(e) => {
                    e.target.checked && setColourMode(ColourMode.rgba);
                  }}
                />
                RGBA
              </label>
              <label>
                <input
                  type="radio"
                  name="rgba"
                  checked={ColourMode.single == colourMode}
                  onChange={(e) => {
                    e.target.checked && setColourMode(ColourMode.single);
                  }}
                />
                SINGLE
              </label>
            </td>
          </tr>
          {ColourMode.single == colourMode && (
            <tr>
              <td>
                <label>Color:</label>
              </td>
              <td>
                <input
                  minLength={6}
                  maxLength={6}
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                />
              </td>
            </tr>
          )}
          {channels
            ? new Array(channels).fill(true).map((_, i) => {
                return (
                  <tr key={i}>
                    <td colSpan={2}>
                      <FunctionSelect
                        label={`${i + 1}`}
                        value={channelFunctions[i]}
                        showMulti={true}
                        onChange={(channelFunction) => {
                          setChannelFunctions((state) => {
                            return { ...state, [i]: channelFunction };
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={dmxValues[i] || 0}
                        onChange={(e) => {
                          setDmxValues((state) => ({
                            ...state,
                            [i]: parseInt(e.target.value),
                          }));
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>

      <button onClick={_onSave}>save</button>
    </div>
  );
};
