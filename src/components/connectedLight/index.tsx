import { Fixture } from "../../context/fixtures";
import { useGlobals } from "../../context/globals";
import { GenericProfile } from "../../context/profiles";
import { mapRGBASToDMX } from "../../utils";
import { Light } from "../light";

export const ConnectedLight = ({
  fixture,
  profile,
}: {
  fixture: Fixture;
  profile?: Omit<GenericProfile, "id">;
}) => {
  const globals = useGlobals((state) => state.globals);

  const state =
    profile &&
    Object.keys(profile.globals).reduce((state, key) => {
      return { ...state, [key]: globals[key] };
    }, profile.state);

  const dmxVals =
    state &&
    profile &&
    mapRGBASToDMX(
      fixture.channelFunctions,
      profile.value.Colour,
      state.Brightness,
      state.Strobe
    );

  return <Light fixture={fixture} dmxValues={dmxVals} />;
};
