import { Fixture } from "../../../../context/fixtures";
import { DeviceFunction } from "./function";
import styles from "./styles.module.scss";

const sampleFunction = () => ({
  id: crypto.randomUUID(),
  label: "",
  values: {},
});

export const Functions = ({
  channels,
  functions,
  setFunctions,
}: {
  channels: Fixture["channelFunctions"];
  functions: Fixture["deviceFunctions"];
  setFunctions: React.Dispatch<
    React.SetStateAction<Fixture["deviceFunctions"]>
  >;
}) => {
  const channelOptions: string[] = channels
    .map((c) => c.map((f) => f.function))
    .flat();

  return (
    <>
      <h5>Functions</h5>

      <div className={styles.functions}>
        {functions?.map((func, funcIndex) => (
          <DeviceFunction
            key={func.id}
            onDelete={() => {
              alert("set!");
            }}
            channelOptions={channelOptions}
            func={func}
            setFunction={(action) => {
              setFunctions((state) => {
                if (!state) return state;
                state[funcIndex] =
                  typeof action === "function"
                    ? action(state[funcIndex])
                    : action;
                return [...state];
              });
            }}
          />
        ))}
        <button
          title="Add Function"
          className={styles.addFunction}
          onClick={() => {
            setFunctions((state) => {
              if (!state) return [sampleFunction()];
              return [...state, sampleFunction()];
            });
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
