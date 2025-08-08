import { useState } from "react";
import {
  Fixture,
  FixtureShape,
  // ChannelFunctions,
  // ColourMode,
  // ColourMode,
} from "../../../context/fixtures";

import styles from "./createFixture.module.scss";
// import { FunctionSelect } from "./function-select";
import { connect } from "../../../dmx";
// import { LightMode } from "./light-mode";
import { Channel, defaultValue } from "./channel";
// import { Light } from "../../../components/light";
// import { Fixture } from "../list/fixture";
import { FixtureComponent } from "../fixture";

export const CreateFixture = ({
  fixture,
  onChange,
  onSubmit,
}: {
  fixture: Fixture;
  onChange: React.Dispatch<React.SetStateAction<Fixture>>;
  onSubmit: () => void;
}) => {
  // const [model, setModel] = useState<string>("");
  // const [channels, setChannels] = useState<number>(1);
  // const [fixtureShape, setFixtureShape] = useState<FixtureShape>(
  //   FixtureShape.circle
  // );
  // const [channels, setChannels] = useState<ChannelFunctions>([[defaultValue]]);
  // const [colourMode, setColourMode] = useState<ColourMode>(ColourMode.fixed);
  // const [colour, setColour] = useState<string>();

  const [dmxValues, setDmxValues] = useState<Record<number, number>>({});
  const [port, setPort] = useState<SerialPort>();

  // useEffect(() => {
  //   port && sendUniverse(port, dmxValues);
  // }, [port, dmxValues]);

  // const _onSave = () => {
  //   // console.log("Saving Fixture", channels);
  //   // if (model && channels)
  //   // onSubmit({
  //   //   id: crypto.randomUUID(),
  //   //   model,
  //   //   channels,
  //   //   channelFunctions: channelFunctions,
  //   //   fixtureShape,
  //   //   colourMode,
  //   //   colour: colourMode === ColourMode.single ? colour : undefined,
  //   // });
  // };

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

      <FixtureComponent dmxValues={dmxValues} fixture={fixture} />
      {/* <button
        onClick={() => {
          console.log(port);
          // port && sendUniverse(port, dmxValues);
        }}
      >
        send
      </button> */}
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
                  onChange((state) => ({
                    ...state,
                    model: e.target.value,
                  }))
                }
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
                    // FIX THIS HERE
                    onChange((state) => {
                      while (state.channelFunctions.length < target) {
                        state.channelFunctions.push([defaultValue]);
                      }
                      return {
                        ...state,
                        channelFunctions: [...state.channelFunctions],
                      };
                    });
                  } else if (fixture.channelFunctions.length > target) {
                    onChange((state) => {
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
                  onChange((state) => ({
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
                setDmxValues={setDmxValues}
                index={i}
                dmxValues={dmxValues}
                channelFunction={channel}
                onChange={(c) => {
                  onChange((state) => ({
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

      <button onClick={onSubmit}>save</button>
    </div>
  );
};
