import { Scene } from "../../../context/scenes";
import { Venue, VenueFixture } from "../../../context/venues";
import { Fixture } from "../../../context/fixtures";
import styles from "./stage-fixture.module.scss";
import { ConnectedLight } from "../../connectedLight";

export const StageFixture = ({
  venueFixture,
  fixture,
}: {
  venue: Venue;
  fixture: Fixture;
  venueFixture: VenueFixture;
  scene?: Scene;
}) => {
  // const venueEditMode = useUI((state) => state.venueEditMode);

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
      onDrop={(e) => {}}
    >
      <div className={styles.info}>
        <table>
          <tbody>
            <tr>
              {/* <td>
                <button
                  className={styles.button}
                  onClick={() => {
                    changeGroup(groupId !== undefined ? groupId - 1 : -1);
                  }}
                >
                  -
                </button>
              </td> */}
              {/* <td>
                {groupId !== undefined ? `Group ${groupId}` : "No Group"}{" "}
              </td> */}
              {/* <td align="right">
                <button
                  className={styles.button}
                  onClick={() => {
                    changeGroup(groupId !== undefined ? groupId + 1 : 0);
                  }}
                >
                  +
                </button>
              </td> */}
            </tr>
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
          // profiles={profiles}
          fixture={fixture}
          venueFixture={venueFixture}
        />
      </div>
    </div>
  );
};
