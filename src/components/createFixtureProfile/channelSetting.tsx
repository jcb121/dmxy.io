import { ChannelFunction } from "../../context/fixtures";

export const ChannelSetting = ({
  channel,
  channelValue,
  onChange,
}: {
  onChange: (n: number) => void;
  channelValue: number;
  channel: ChannelFunction;
}) => {
  return (
    <>
      {Object.keys(channel).map((functionIndex) => {
        const func = channel[parseInt(functionIndex)];

        return (
          <tr>
            <td>
              <span
                style={{
                  padding: "1px",
                  margin: "1px",
                  background: func.function,
                }}
              >
                {func.function}
              </span>
              :
            </td>
            <td>
              <input
                type="range"
                min={func.range[0]}
                max={func.range[1]}
                step="1"
                value={channelValue}
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                  //   setDmxValues((state) => {
                  //     return {
                  //       ...state,
                  //       [i]: parseInt(e.target.value),
                  //     };
                  //   });
                }}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
};
