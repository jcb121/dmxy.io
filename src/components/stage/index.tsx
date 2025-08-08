import { useContext, useRef } from "react";
import { FixtureContext } from "../../context/fixtures";
import styles from "./stage.module.scss";
import { Venue, VenueContext } from "../../context/venues";
import { Scene } from "../../context/scenes";
import { StageFixture } from "./stage-fixture/stage-fixture";

export const Stage = ({ scene, venue }: { scene?: Scene; venue: Venue }) => {
  const { fixtures } = useContext(FixtureContext);
  const { updateVenue } = useContext(VenueContext);

  const { venueFixtures } = venue;
  const ref = useRef<HTMLDivElement>(null);

  if (!scene) return null;

  return (
    <div
      ref={ref}
      className={styles.stage}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("id");
        const { top, left } = ref.current!.getBoundingClientRect();

        if (!id) {
          const fixtureId = e.dataTransfer.getData("fixtureId");
          const fixture = fixtures.find((f) => f.id === fixtureId);
          if (!fixture) return;
          const id = crypto.randomUUID();
          updateVenue({
            ...venue,
            venueFixtures: [
              ...venue.venueFixtures,
              {
                tags: [],
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
