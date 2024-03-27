import { useMemo, useState } from "react";
import {
  SubChannelFunction,
  ChannelFunction,
  ChannelSimpleFunction,
} from "../../context/fixtures";

const defaultValue: SubChannelFunction = {
  range: [0, 255],
  function: ChannelSimpleFunction.unknow,
};

export const FunctionSelect = ({
  // onMultiSelect,
  onChange,
  value = {},
  // showMulti,
  label,
}: {
  label: React.ReactNode;
  // onMultiSelect: () => void;
  showMulti?: boolean;
  value?: ChannelFunction;
  onChange: (e: ChannelFunction) => void;
}) => {
  // const [min, setMin] = useState(0);
  // const [max, setMax] = useState(255);
  // const [func, setFunction] = useState<ChannelSimpleFunction>();
  const [multi, setMulti] = useState(false);
  // const [functions, setFunctions] = useState([1, 2]);

  const state = useMemo<SubChannelFunction[]>(() => {
    const keys = Object.keys(value);

    if (keys.length === 0) return [defaultValue];

    if (multi) {
      return [...keys.map((key) => value[parseInt(key)]), defaultValue];
    } else {
      return keys.map((key) => value[parseInt(key)]);
    }
  }, [value, multi]);

  return (
    <div>
      {`CH${label}: `}
      <label>
        Multi Function?
        <input
          type="checkbox"
          value={multi ? "true" : "false"}
          onChange={(e) => {
            setMulti(e.target.checked);
          }}
        />
      </label>

      {state.map((func, index) => {
        return (
          <div>
            <select
              value={func.function}
              onChange={(e) => {
                onChange({
                  ...value,
                  [index]: {
                    ...defaultValue,
                    ...value[index],
                    function: e.target.value as ChannelSimpleFunction,
                  },
                });
              }}
            >
              {Object.keys(ChannelSimpleFunction).map((key) => {
                // @ts-expect-error key is the wrong type
                return <option>{ChannelSimpleFunction[key]}</option>;
              })}
            </select>

            {func.function === ChannelSimpleFunction.function && (
              <span>
                {" "}
                <input
                  placeholder="Function name"
                  onChange={(e) => {
                    onChange({
                      ...value,
                      [index]: {
                        ...defaultValue,
                        ...value[index],
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </span>
            )}

            {func.function === ChannelSimpleFunction.colour && (
              <span>
                <span
                  style={{
                    background: `#${func.value}`,
                  }}
                >
                  #
                </span>
                <input
                  placeholder="HTML color Code"
                  // type="number"
                  prefix="#"
                  onChange={(e) => {
                    onChange({
                      ...value,
                      [index]: {
                        ...defaultValue,
                        ...value[index],
                        value: e.target.value.replace("#", ""),
                      },
                    });
                  }}
                />
              </span>
            )}

            {multi && (
              <>
                <label>
                  from{" "}
                  <input
                    value={func?.range[0] || defaultValue.range[0]}
                    onChange={(e) => {
                      onChange({
                        ...value,
                        [index]: {
                          ...defaultValue,
                          ...value[index],
                          range: [
                            parseInt(e.target.value),
                            func?.range[1] || defaultValue.range[1],
                          ],
                        },
                      });
                    }}
                    min={0}
                    max={255}
                    step={1}
                    type="number"
                  />
                </label>
                <label>
                  to{" "}
                  <input
                    value={func?.range[1] || defaultValue.range[1]}
                    onChange={(e) => {
                      onChange({
                        ...value,
                        [index]: {
                          ...defaultValue,
                          ...value[index],
                          range: [
                            func?.range[0] || defaultValue.range[0],
                            parseInt(e.target.value),
                          ],
                        },
                      });
                    }}
                    min={0}
                    max={255}
                    step={1}
                    type="number"
                  />
                </label>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
