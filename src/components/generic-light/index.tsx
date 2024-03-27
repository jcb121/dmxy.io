import {
  ChannelFunctions,
  ChannelSimpleFunction,
  ColourMode,
  FixtureShape,
} from "../../context/fixtures";
import { GenericProfile } from "../../context/profiles";
import { ConnectedLight } from "../connectedLight";

const channelFunctions: ChannelFunctions = {
  0: {
    0: {
      function: ChannelSimpleFunction.colour,
      value: "ff0000",
      range: [0, 255],
    },
  },
  1: {
    0: {
      function: ChannelSimpleFunction.colour,
      value: "00ff00",
      range: [0, 255],
    },
  },
  2: {
    0: {
      function: ChannelSimpleFunction.colour,
      value: "0000ff",
      range: [0, 255],
    },
  },
  3: {
    0: {
      function: ChannelSimpleFunction.brightness,
      range: [0, 255],
    },
  },
  4: {
    0: {
      function: ChannelSimpleFunction.strobe,
      range: [0, 255],
    },
  },
};

export const GenericLight = ({
  profile,
}: {
  profile: Omit<GenericProfile, "id">;
}) => {
  return (
    <ConnectedLight
      fixture={{
        colourMode: ColourMode.rgba,
        id: "",
        model: "RBGA",
        channels: 5,
        channelFunctions,
        fixtureShape: FixtureShape.circle,
      }}
      profile={profile}
    />
  );
};
