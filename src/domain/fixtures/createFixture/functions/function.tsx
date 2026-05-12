import { FixtureFunction } from "../../../../context/fixtures";
import { Button } from "../../../../ui/buttonLink";
import { FunctionValue } from "./function-value";
import styles from "./styles.module.scss";

export const DeviceFunction = ({
  func,
  setFunction,
  channelOptions,
  onDelete,
}: {
  onDelete: () => void;
  channelOptions: string[];
  func: FixtureFunction;
  setFunction: React.Dispatch<React.SetStateAction<FixtureFunction>>;
}) => {
  const keys = Object.keys(func.values);

  return (
    <>
      {keys.map((key, index) => {
        return (
          <tr key={index} data-testid="fixture-function">
            {index == 0 && (
              <td rowSpan={keys.length}>
                <input
                  placeholder="Function name"
                  className={styles.input}
                  value={func.label}
                  onChange={(e) => {
                    setFunction((state) => {
                      return {
                        ...state,
                        label: e.target.value,
                      };
                    });
                  }}
                />
              </td>
            )}

            {/* returns TD TD */}
            <FunctionValue
              key={key}
              channelOptions={channelOptions}
              channel={key}
              value={func.values[key]}
              onChange={(channel, value) => {
                setFunction((state) => {
                  if (channel !== key) {
                    delete state.values[key];
                  }
                  state.values[channel] = value;
                  return {
                    ...state,
                    values: { ...state.values },
                  };
                });
              }}
              onDelete={() => {
                if (Object.keys(func.values).length === 1) {
                  onDelete();
                  return;
                }
                setFunction((state) => {
                  delete state.values[key];
                  return {
                    ...state,
                    values: { ...state.values },
                  };
                });
              }}
            />
          </tr>
        );
      })}

      <tr>
        <td colSpan={4} style={{ textAlign: "center" }}>
          <Button
            onClick={() => {
              setFunction((state) => ({
                ...state,
                values: { ...state.values, "": 0 },
              }));
            }}
          >
            Add row
          </Button>
        </td>
      </tr>
    </>
  );
};
