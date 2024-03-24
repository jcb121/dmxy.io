import { useContext } from "react";
import { Scene, SceneContext } from "../../../context/scenes";
import { Venue, VenueContext, VenueFixture } from "../../../context/venues";
import { Light } from "../../light";
import { Fixture, FixtureContext } from "../../../context/fixtures";
import styles from "./stage-fixture.module.scss";

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
  const { fixtureProfiles } = useContext(FixtureContext);
  const { updateVenue } = useContext(VenueContext);

  const groupId = scene.fixtureGroups.findIndex((fixtureIds) =>
    fixtureIds.includes(venueFixture.id)
  );

  const profileId = scene.profiles[groupId];

  const profile = fixtureProfiles.find((p) => p.id === profileId);

  const dmxValues = profileId
    ? fixtureProfiles.find((p) => p.id === profileId)?.dmxValues
    : undefined;

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
    console.log(targetChannel);
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
        const profile = fixtureProfiles.find((f) => f.id === profileId);
        if (!profile) return;

        updateScene({
          ...scene,
          profiles: {
            ...scene.profiles,
            [groupId]: profile.id,
          },
        });
      }}
    >
      <div className={styles.info}>
        <table>
          <tr>
            <th colSpan={3}>
              {fixture.model} ch{fixture.channels}
            </th>
          </tr>
          <tr>
            <th colSpan={3}>{profile?.name}</th>
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
        </table>
      </div>

      <Light fixture={fixture} dmxValues={dmxValues} />
    </div>
  );
};
