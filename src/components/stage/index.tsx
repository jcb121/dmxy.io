import { useContext, useRef } from "react";
import { FixtureContext } from "../../context/fixtures";
import styles from "./stage.module.scss";
import { VenueContext } from "../../context/venues";
import { Scene, SceneContext } from "../../context/scenes";
import { StageFixture } from "./stage-fixture/stage-fixture";

export const Stage = ({ scene }: { scene: Scene }) => {
  const { fixtures } = useContext(FixtureContext);
  const { venues, updateVenue } = useContext(VenueContext);

  const { updateScene } = useContext(SceneContext);

  const venue = venues[0];
  const { venueFixtures } = venue;
  const ref = useRef<HTMLDivElement>(null);

  // group to scene
  // const [scene, setScene] = useState<Record<string, string>>({});
  // liveFixtureId to group
  // const [groups, setGroups] = useState<string[][]>([]);

  return (
    <div
      ref={ref}
      className={styles.stage}
      onDrop={(e) => {
        const fixtureId = e.dataTransfer.getData("fixtureId");
        const { top, left } = ref.current!.getBoundingClientRect();
        const fixture = fixtures.find((f) => f.id === fixtureId);

        if (!fixture) return;

        const id = crypto.randomUUID();

        updateScene({
          ...scene,
          fixtureGroups: [...scene.fixtureGroups, [id]],
        });

        updateVenue({
          ...venue,
          venueFixtures: [
            ...venue.venueFixtures,
            {
              channel: 0,
              id,
              fixtureId,
              x: e.clientX - left,
              y: e.clientY - top,
            },
          ],
        });
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
