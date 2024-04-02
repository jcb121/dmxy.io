import { useContext, useMemo } from "react";
import { Scene, SceneContext } from "../../../context/scenes";
import { Venue, VenueContext, VenueFixture } from "../../../context/venues";
import { Fixture } from "../../../context/fixtures";
import styles from "./stage-fixture.module.scss";
import { GenericProfile, ProfileContext } from "../../../context/profiles";
import { ConnectedLight } from "../../connectedLight";

export const StageFixture = ({
  venueFixture,
  fixture,
  scene,
  venue,
}: {
  venue: Venue;
  fixture: Fixture;
  venueFixture: VenueFixture;
  scene: Scene;
}) => {
  const { updateScene } = useContext(SceneContext);
  const { updateVenue } = useContext(VenueContext);
  const { profiles: allProfiles } = useContext(ProfileContext);

  const groupId = useMemo(() => {
    const foundIndex = scene.fixtureGroups.findIndex((fixtureIds) =>
      fixtureIds?.includes(venueFixture.id)
    );

    return foundIndex > -1 ? foundIndex : 0;
  }, [scene.fixtureGroups, venueFixture.id]);

  const profileIds = scene.profiles[groupId] || []; //as string[] | undefined;
  const profiles = profileIds
    .map((id) => allProfiles.find((p) => p.id == id))
    .filter((a) => !!a) as GenericProfile[];

  const changeGroup = (targetGroup: number) => {
    if (targetGroup < 0) return;

    const fixtureGroups = scene.fixtureGroups.reduce((fixtureGroups, group) => {
      return [
        ...fixtureGroups,
        (group || []).filter((id) => id !== venueFixture.id),
      ];
    }, [] as string[][]);

    if (fixtureGroups[targetGroup]) {
      fixtureGroups[targetGroup].push(venueFixture.id);
    } else {
      fixtureGroups[targetGroup] = [venueFixture.id];
    }

    updateScene({
      ...scene,
      fixtureGroups,
    });
  };

  const changeChannel = (targetChannel: number) => {
    updateVenue({
      ...venue,
      venueFixtures: venue.venueFixtures.map((f) => {
        if (f.id === venueFixture.id) {
          return {
            ...f,
            channel: targetChannel,
          };
        }
        return f;
      }),
    });
  };

  return (
    <div
      key={`${venueFixture.id}`}
      style={{
        position: "absolute",
        top: `${venueFixture.y}px`,
        left: `${venueFixture.x}px`,
        transform: "translate(-50%, -50%)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const profileId = e.dataTransfer.getData("profileId");
        const profile = allProfiles.find((f) => f.id === profileId);

        if (!profile) return;

        const profileIds =
          (scene.profiles[groupId] as string[] | undefined) || [];

        updateScene({
          ...scene,
          profiles: {
            ...scene.profiles,
            [groupId]: [...profileIds, profile.id],
          },
        });
      }}
    >
      <div className={styles.info}>
        <table>
          <tbody>
            <tr>
              <th colSpan={3}>
                {fixture.model} ch{fixture.channels}
              </th>
            </tr>
            <tr>
              <th colSpan={3}>
                {profiles?.map((prof) => (
                  <button
                    onClick={() => {
                      const profileIds =
                        (scene.profiles[groupId] as string[] | undefined) || [];

                      updateScene({
                        ...scene,
                        profiles: {
                          ...scene.profiles,
                          [groupId]: profileIds.filter((p) => p != prof.id),
                        },
                      });
                    }}
                  >
                    {prof.name} X
                  </button>
                ))}
              </th>
            </tr>
            <tr>
              <td>
                <button
                  onClick={() => {
                    changeChannel(venueFixture.channel - 1);
                  }}
                >
                  -
                </button>
              </td>
              <td>
                Channel {venueFixture.channel} -{" "}
                {venueFixture.channel + fixture.channels}
              </td>
              <td align="right">
                <button
                  onClick={() => {
                    changeChannel(venueFixture.channel + 1);
                  }}
                >
                  +
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  onClick={() => {
                    changeGroup(groupId - 1);
                  }}
                >
                  -
                </button>
              </td>
              <td>Group {groupId}</td>
              <td align="right">
                <button
                  onClick={() => {
                    changeGroup(groupId + 1);
                  }}
                >
                  +
                </button>
              </td>
            </tr>
            {/* <tr>
              <td>
                <button>clone</button>
              </td>
              <td></td>
              <td>
                <button>delete</button>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("id", venueFixture.id);
        }}
      >
        <ConnectedLight
          channel={venueFixture.channel}
          profiles={profiles}
          fixture={fixture}
        />
      </div>
    </div>
  );
};
