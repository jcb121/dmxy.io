import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { getRGB } from "../../../utils/rgb";
import styles from "./styles.module.scss";

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
  return (
    <div>
      <table>
        <tbody>
          {options?.map((functionName) => {
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
                  targetFunction:  frame.targetFunction === functionName ? undefined : functionName,
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
