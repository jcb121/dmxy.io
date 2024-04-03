import { useContext, useMemo } from "react";
import { Scene, SceneContext } from "../../../context/scenes";
import { Venue, VenueContext, VenueFixture } from "../../../context/venues";
import { Fixture } from "../../../context/fixtures";
import styles from "./stage-fixture.module.scss";
import { GenericProfile, ProfileContext } from "../../../context/profiles";
import { ConnectedLight } from "../../connectedLight";
import { useUI } from "../../../context/ui";

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
  const venueEditMode = useUI((state) => state.venueEditMode);

  const groupId = useMemo<number | undefined>(() => {
    const foundIndex = scene.fixtureGroups.findIndex((fixtureIds) =>
      fixtureIds?.includes(venueFixture.id)
    );

    return foundIndex > -1 ? foundIndex : undefined;
  }, [scene.fixtureGroups, venueFixture.id]);

  const profileIds = (groupId !== undefined && scene.profiles[groupId]) || []; //as string[] | undefined;
  const profiles = profileIds
    .map((id) => allProfiles.find((p) => p.id == id))
    .filter((a) => !!a) as GenericProfile[];

  const changeGroup = (targetGroup: number) => {
    const fixtureGroups = scene.fixtureGroups.reduce((fixtureGroups, group) => {
      return [
        ...fixtureGroups,
        (group || []).filter((id) => id !== venueFixture.id),
      ];
    }, [] as string[][]);

    if (targetGroup > -1) {
      if (fixtureGroups[targetGroup]) {
        fixtureGroups[targetGroup] = [
          ...fixtureGroups[targetGroup],
          venueFixture.id,
        ];
      } else {
        fixtureGroups[targetGroup] = [venueFixture.id];
      }
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
          (groupId !== undefined &&
            (scene.profiles[groupId] as string[] | undefined)) ||
          [];

        if (groupId === undefined) return;

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
                    className={styles.button}
                    onClick={() => {
                      const profileIds =
                        (groupId !== undefined &&
                          (scene.profiles[groupId] as string[] | undefined)) ||
                        [];

                      if (groupId == undefined) return;

                      updateScene({
                        ...scene,
                        profiles: {
                          ...scene.profiles,
                          [groupId]: profileIds.filter((p) => p != prof.id),
                        },
                      });
                    }}
                  >
                    {prof.name}
                  </button>
                ))}
              </th>
            </tr>
            {venueEditMode && (
              <tr>
                <td>
                  <button
                    className={styles.button}
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
                    className={styles.button}
                    onClick={() => {
                      changeChannel(venueFixture.channel + 1);
                    }}
                  >
                    +
                  </button>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <button
                  className={styles.button}
                  onClick={() => {
                    changeGroup(groupId !== undefined ? groupId - 1 : -1);
                  }}
                >
                  -
                </button>
              </td>
              <td>
                {groupId !== undefined ? `Group ${groupId}` : "No Group"}{" "}
              </td>
              <td align="right">
                <button
                  className={styles.button}
                  onClick={() => {
                    changeGroup(groupId !== undefined ? groupId + 1 : 0);
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
