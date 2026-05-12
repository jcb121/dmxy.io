import { Fixture } from "../../../../context/fixtures";
import { Button } from "../../../../ui/buttonLink";
import { DeviceFunction } from "./function";
import styles from "./styles.module.scss";

const sampleFunction = () => ({
  id: crypto.randomUUID(),
  label: "",
  values: {
    "": 0,
  },
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
  const channelOptions: string[] = channels.map((_, i) => String(i + 1));

  return (
    <>
      <h5>Functions</h5>

      <table>
        <thead>
          <tr>
            <th>Function name</th>
            <th>Channel</th>
            <th>Value</th>
            <th style={{ width: "1px", whiteSpace: "nowrap" }}></th>
          </tr>
        </thead>
        <tbody>
          {functions?.map((func, funcIndex) => (
            <DeviceFunction
              key={func.id}
              onDelete={() => {
                setFunctions((state) => {
                  if (!state) return state;
                  return state.filter((_, i) => i !== funcIndex);
                });
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
        </tbody>
      </table>

      <Button
        title="Add Function"
        onClick={() => {
          setFunctions((state) => {
            if (!state) return [sampleFunction()];
            return [...state, sampleFunction()];
          });
        }}
      >
        Add Function
      </Button>
    </>
  );
};
