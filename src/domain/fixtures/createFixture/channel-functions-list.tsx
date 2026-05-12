import { ChannelFunctions } from "../../../context/fixtures";
import { Button } from "../../../ui/buttonLink";
import { Channel, defaultValue } from "./channel";

export const ChannelFunctionsList = ({
  channelFunctions,
  onChange,
}: {
  channelFunctions: ChannelFunctions;
  onChange: (channelFunctions: ChannelFunctions) => void;
}) => {
  return (
    <>
      <h5>Channels</h5>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Function</th>
            <th>From</th>
            <th>To</th>
            <th>Map Intensity</th>
            <th>Value</th>
            <th style={{ width: "1px", whiteSpace: "nowrap" }}></th>
          </tr>
        </thead>
          {channelFunctions.map((channel, i) => (
            <Channel
              key={i}
              index={i}
              channelFunction={channel}
              onChange={(c) =>
                onChange(
                  channelFunctions.map((s, index) => (index === i ? c : s)),
                )
              }
            />
          ))}
      </table>
      <Button onClick={() => onChange([...channelFunctions, [defaultValue]])}>
        Add Channel
      </Button>
    </>
  );
};
