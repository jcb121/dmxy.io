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
      function: ChannelSimpleFunction.red,
      range: [0, 255],
    },
  },
  1: {
    0: {
      function: ChannelSimpleFunction.green,
      range: [0, 255],
    },
  },
  2: {
    0: {
      function: ChannelSimpleFunction.blue,
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
  5: {
    0: {
      function: ChannelSimpleFunction.white,
      range: [0, 255],
    },
  },
};

const fixture = {
  colourMode: ColourMode.rgbw,
  id: "",
  model: "RBGA",
  channels: 5,
  channelFunctions,
  fixtureShape: FixtureShape.circle,
};

export const GenericLight = ({
  profile,
}: {
  profile: Omit<GenericProfile, "id">;
}) => {
  return <ConnectedLight fixture={fixture} profiles={[profile]} />;
};
