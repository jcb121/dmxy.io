import { useContext } from "react";
import { Scene, SceneContext } from "../../../context/scenes";
import { Venue, VenueContext, VenueFixture } from "../../../context/venues";
import { Fixture } from "../../../context/fixtures";
import styles from "./stage-fixture.module.scss";
import { ProfileContext } from "../../../context/profiles";
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
  const groupId = scene.fixtureGroups.findIndex((fixtureIds) =>
    fixtureIds.includes(venueFixture.id)
  );
  const profileIds = scene.profiles[groupId] as string[] | undefined;
  const profiles = profileIds
    ? allProfiles.filter((p) => profileIds.includes(p.id))
    : [];

  const changeGroup = (targetGroup: number) => {
    scene.fixtureGroups[groupId] = scene.fixtureGroups[groupId].filter(
      (id) => id != venueFixture.id
    );
    if (scene.fixtureGroups[targetGroup]) {
      scene.fixtureGroups[targetGroup].push(venueFixture.id);
    } else {
      scene.fixtureGroups[targetGroup] = [venueFixture.id];
    }
    updateScene({
      ...scene,
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
              <th colSpan={3}>{profiles.map((prof) => prof.name).join(",")}</th>
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
            <tr>
              <td>
                <button>clone</button>
              </td>
              <td></td>
              <td>
                <button>delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO sort this out */}
      <ConnectedLight
        channel={venueFixture.channel}
        profiles={profiles}
        fixture={fixture}
      />
    </div>
  );
};
