import { useContext, useRef } from "react";
import { FixtureContext } from "../../context/fixtures";
import styles from "./stage.module.scss";
import { VenueContext } from "../../context/venues";
import { Scene } from "../../context/scenes";
import { StageFixture } from "./stage-fixture/stage-fixture";

export const Stage = ({ scene }: { scene: Scene }) => {
  const { fixtures } = useContext(FixtureContext);
  const { venues, updateVenue } = useContext(VenueContext);

  const venue = venues[0];
  const { venueFixtures } = venue;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={styles.stage}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("id");
        const { top, left } = ref.current!.getBoundingClientRect();

        console.log("DROP", id)

        if (!id) {
          const fixtureId = e.dataTransfer.getData("fixtureId");
          const fixture = fixtures.find((f) => f.id === fixtureId);
          if (!fixture) return;
          const id = crypto.randomUUID();
          // updateScene({
          //   ...scene,
          //   fixtureGroups: [...scene.fixtureGroups, [id]],
          // });
          updateVenue({
            ...venue,
            venueFixtures: [
              ...venue.venueFixtures,
              {
                channel: 1,
                id,
                fixtureId,
                x: e.clientX - left,
                y: e.clientY - top,
              },
            ],
          });
        } else {
          updateVenue({
            ...venue,
            venueFixtures: venue.venueFixtures.map((f) =>
              f.id === id
                ? { ...f, x: e.clientX - left, y: e.clientY - top }
                : f
            ),
          });
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {venueFixtures.map((venueFixture) => {
        const fixture = fixtures.find((f) => f.id === venueFixture.fixtureId);
        if (!fixture) return;

        return (
          <StageFixture
            key={venueFixture.id}
            venue={venue}
            fixture={fixture}
            scene={scene}
            venueFixture={venueFixture}
          />
        );
      })}
    </div>
  );
};
