import { useDmx } from "../../../context/dmx";
import { useActiveVenue } from "../../../context/venues";

export const DmxDevicePills = () => {
  const connect = useDmx(true);
  const venue = useActiveVenue((state) => state.venue);
  const universes = venue?.venueFixtures.reduce((universes, vf) => {
    if (universes.includes(vf.universe || 0)) {
      return universes;
    }
    return [...universes, vf.universe || 0];
  }, [] as number[]);

  console.log("connect.devices", connect.devices)

  return (
    <>
      {connect.devices.map(({ type, deviceIndex }) => (
        <div key={`${type}_${deviceIndex}`} data-testid="device-dmx-universe-select">
          {type} Device {deviceIndex} UNI:
          <select
            value={connect.connections[`${type}_${deviceIndex}`] ?? ""}
            onChange={(e) => {
              connect.connect(
                { type, deviceIndex },
                e.target.value == "" ? undefined : parseInt(e.target.value),
              );
            }}
          >
            <option value=""></option>
            {universes?.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
};
