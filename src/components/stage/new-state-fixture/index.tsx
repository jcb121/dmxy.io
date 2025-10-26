import { useFixtures } from "../../../context/fixtures";
import { VenueFixture } from "../../../context/venues";
import { FixtureComponent } from "../../../domain/fixtures/fixture";

import styles from "./styles.module.scss";

export const NewStageFixture = ({
  onClick,
  venueFixture,
  onDrop,
  onDrag,
  info,
}: {
  onClick?: () => void;
  info?: React.ReactNode;
  venueFixture: VenueFixture;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
}) => {
  const fixture = useFixtures((state) =>
    state.fixtures.find((f) => f.id === venueFixture.fixtureId)
  );

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
      onDrop={onDrop}
    >
      <div className={styles.info}>{info}</div>
      <div
        onClick={onClick}
        draggable={onDrag ? true : false}
        onDragStart={(e) => onDrag && onDrag(e)}
      >
        {fixture && <FixtureComponent fixture={fixture} />}
      </div>
    </div>
  );
};
