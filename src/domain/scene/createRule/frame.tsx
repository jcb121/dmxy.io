import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { getRGB, rgbToHex } from "../../../utils/rgb";
import styles from "./styles.module.scss";

const RGB = [
  ChannelSimpleFunction.red,
  ChannelSimpleFunction.green,
  ChannelSimpleFunction.blue,
];

export const Frame = ({
  frame,
  options,
  colourOptions,
  setFrame,
  functions,
}: {
  frame: New_GenericProfile;
  options: ChannelSimpleFunction[];
  colourOptions: string[];
  functions: string[];
  setFrame: React.Dispatch<React.SetStateAction<New_GenericProfile>>;
}) => {
  const isRGB = RGB.every((func) => {
    return options.find((channel) => {
      return channel === func;
    });
  });

  const hasWhite = options.find(
    (channel) => channel === ChannelSimpleFunction.white
  );

  return (
    <div>
      <table>
        <tbody>
          {isRGB && (
            <tr>
              <td>Color</td>
              <td>
                <input
                  type="color"
                  value={`#${rgbToHex([
                    frame.state.Red!,
                    frame.state.Green!,
                    frame.state.Blue!,
                  ])}`}
                  onChange={(e) => {
                    const [Red, Green, Blue] = getRGB(e.target.value.slice(1));

                    if (hasWhite && Red === Green && Red === Blue) {
                      setFrame((frame) => {
                        return {
                          ...frame,
                          state: {
                            ...frame.state,
                            White: Red,
                            Red: 0,
                            Green: 0,
                            Blue: 0,
                          },
                        };
                      });
                      return;
                    }

                    setFrame((frame) => {
                      return {
                        ...frame,
                        state: {
                          ...frame.state,
                          White: 0,
                          Red,
                          Green,
                          Blue,
                        },
                      };
                    });
                  }}
                />
              </td>
            </tr>
          )}

          {options?.map((functionName) => {
            if (RGB.includes(functionName)) {
              return null;
            }
            return (
              <tr key={functionName}>
                <td>{functionName}</td>
                <td>
                  <div>
                    <input
                      min={0}
                      max={255}
                      type="range"
                      value={frame.state[functionName] || 0}
                      onChange={(e) =>
                        setFrame((frame) => {
                          return {
                            ...frame,
                            state: {
                              ...frame.state,
                              [functionName]: parseInt(e.target.value),
                            },
                          };
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.functions}>
        {colourOptions?.map((colour) => {
          return (
            <button
              key={colour}
              onClick={() =>
                setFrame((frame) => {
                  const [red, green, Blue] = getRGB(colour);

                  return {
                    ...frame,
                    state: {
                      ...frame.state,
                      [ChannelSimpleFunction.red]: red,
                      [ChannelSimpleFunction.green]: green,
                      [ChannelSimpleFunction.blue]: Blue,
                    },
                  };
                })
              }
              style={{
                background: `#${colour}`,
              }}
            >
              {colour}
            </button>
          );
        })}
      </div>

      <div className={styles.functions}>
        {/* <button
          style={{
            borderColor: frame.targetFunction === undefined ? "red" : undefined,
          }}
          onClick={() => {
            setFrame((frame) => {
              return { ...frame, targetFunction: undefined };
            });
          }}
        >
          none
        </button> */}
        {functions.map((functionName) => (
          <button
            key={functionName}
            style={{
              borderColor:
                frame.targetFunction === functionName ? "red" : undefined,
            }}
            onClick={() => {
              setFrame((frame) => {
                return {
                  ...frame,
                  targetFunction:
                    frame.targetFunction === functionName
                      ? undefined
                      : functionName,
                };
              });
            }}
          >
            {functionName}
          </button>
        ))}
      </div>
    </div>
  );
};
