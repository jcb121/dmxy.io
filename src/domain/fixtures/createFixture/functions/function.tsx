import { FixtureFunction } from "../../../../context/fixtures";
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
  return (
    <div className={styles.function}>
      <div className={styles.header}>
        <input
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

        <button onClick={onDelete}>🗑</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(func.values).map((key) => {
            return (
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
                  setFunction((state) => {
                    delete state.values[key];
                    return {
                      ...state,
                      values: { ...state.values },
                    };
                  });
                }}
              />
            );
          })}
          <FunctionValue
            disabled={!func.label}
            onChange={(channel, value) => {
              setFunction((state) => {
                state.values[channel] = value;
                return {
                  ...state,
                  values: { ...state.values },
                };
              });
            }}
            channelOptions={channelOptions}
            channel={""}
            value={0}
          />
        </tbody>
      </table>
    </div>
  );
};
