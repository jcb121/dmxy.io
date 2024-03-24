import { useState } from "react";
import {
  Fixture,
  FixtureShape,
  ChannelFunctions,
} from "../../context/fixtures";

import styles from "./createFixture.module.scss";
import { FunctionSelect } from "./function-select";

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

  const _onSave = () => {
    console.log(channelFunctions);

    // if (model && channels)
    onSubmit({
      id: crypto.randomUUID(),
      model,
      channels,
      channelFunctions: channelFunctions,
      fixtureShape,
    });
  };

  return (
    <div className={styles.root}>
      Create fixture
      <label>
        Name:
        <input value={model} onChange={(e) => setModel(e.target.value)} />
      </label>
      <label>
        Channels:
        <input
          type="number"
          value={channels}
          onChange={(e) => setChannels(parseInt(e.target.value))}
        />
      </label>
      <label>
        Shape:
        <select
          value={fixtureShape}
          onChange={(e) => {
            setFixtureShape(e.target.value as FixtureShape);
          }}
        >
          <option value={"circle"}>Circle</option>
        </select>
      </label>
      {channels
        ? new Array(channels).fill(true).map((_, i) => {
            return (
              <div>
                <label>
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

                  {/* <select
                    // value={channelOptions[i]}
                    onChange={(e) => {
                      if (e.target.value === "Multi") {
                        setMulti((state) => ({
                          ...state,
                          [i]: ["HERE"],
                        }));
                      } else {
                        setMulti((state) => ({
                          ...state,
                          [i]: undefined,
                        }));
                        setChannelFunctions((state) => {
                          return {
                            ...state,
                            [i]: [
                              {
                                function: e.target
                                  .value as ChannelSimpleFunction,
                                range: [0, 255],
                              },
                            ],
                          };
                        });
                      }
                    }}
                  >
                    {Object.keys(ChannelSimpleFunction).map((key) => {
                      // @ts-expect-error key is the wrong type
                      return <option>{ChannelSimpleFunction[key]}</option>;
                    })}
                    <option>Multi</option>
                  </select> */}
                </label>

                {/* {mutli[i]?.map((subFunction) => {
                  return (
                    <div>
                      Extra
                      <FunctionSelect
                        value={subFunction}
                        showMulti={false}
                        onChange={(subFunc) => {}}
                      />
                    </div>
                  );
                })} */}

                {/* {mutli[i] && (
                  <div
                    onClick={() => {
                      setMulti((state) => ({
                        ...state,
                        [i]: [...(state[i] || []), "a"],
                      }));
                    }}
                  >
                    <button>Add Extra row</button>
                  </div>
                )} */}
              </div>
            );
          })
        : null}
      <button onClick={_onSave}>save</button>
    </div>
  );
};
