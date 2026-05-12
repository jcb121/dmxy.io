import { useFixtures } from "../../../context/fixtures";
import { VenueFixture } from "../../../context/venues";
import { FixtureComponent } from "../../../domain/fixtures/fixture";
import { useStageTransform } from "../new-stage/context";
import styles from "./styles.module.scss";

export const NewStageFixture = ({
  onClick,
  venueFixture,
  onDrop,
  onDrag,
  info,
}: {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  info?: React.ReactNode;
  venueFixture: VenueFixture;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrag?: (e: React.DragEvent<HTMLDivElement>) => void;
}) => {
  const { toDisplay } = useStageTransform();
  const { left, top } = toDisplay(venueFixture.x, venueFixture.y);

  const fixture = useFixtures((state) =>
    state.fixtures.find((f) => f.id === venueFixture.fixtureId),
  );

  return (
    <div
      data-testid="stage-fixture"
      key={`${venueFixture.id}`}
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={onDrop}
      onClick={(e) => {
        e.stopPropagation();
      }}
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
