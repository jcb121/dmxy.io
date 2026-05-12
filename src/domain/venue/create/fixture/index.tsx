import { NewStageFixture } from "../../../../components/stage/new-state-fixture";
import { Tags } from "../../../../components/stage/tags/tags";
import { useFixtures } from "../../../../context/fixtures";
import { Venue, VenueFixture } from "../../../../context/venues";
import styles from "./styles.module.scss";

export const VenueFixtureComp = ({
  venueFixture,
  activeVenueFixtureId,
  setActiveVenueFixtureId,
  setVenue,
  hasOverlap,
}: {
  venueFixture: VenueFixture;
  activeVenueFixtureId?: string;
  hasOverlap?: boolean;
  setVenue: React.Dispatch<React.SetStateAction<Venue>>;
  setActiveVenueFixtureId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}) => {
  const fixture = useFixtures((state) =>
    state.fixtures.find((f) => f.id === venueFixture.fixtureId),
  );
  if (!fixture) return;

  return (
    <NewStageFixture
      key={venueFixture.id}
      onDrag={(e) => {
        e.dataTransfer.setData("id", venueFixture.id);
      }}
      onClick={() => {
        setActiveVenueFixtureId(venueFixture.id);
      }}
      info={
        <div
          className={styles.root}
          style={{
            outline:
              (activeVenueFixtureId === venueFixture.id && "1px solid red") ||
              undefined,
          }}
        >
          <div title={`(ch: ${fixture.channelFunctions.length})`}>
            {`${fixture.model}`}
          </div>
          <div className={styles.buttons}></div>

          <div>
            <Tags
              selector="stage-fixture"
              tags={venueFixture.tags}
              updateTags={(tags) => {
                const _tags = new Set(tags);
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) =>
                    v.id === venueFixture.id ? { ...v, tags: [..._tags] } : v,
                  ),
                }));
              }}
            />
          </div>

          <div className={`${styles.channel} ${hasOverlap ? styles.overlap : ""}`}>
            <label>Uni:</label>
            <input
              className={styles.input}
              type="number"
              title="universe"
              value={venueFixture.universe || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) return;
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) =>
                    v.id === venueFixture.id ? { ...v, universe: value } : v,
                  ),
                }));
              }}
            />
            <label>CH:</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              max={512}
              title="channel"
              value={venueFixture.channel}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) return;
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) =>
                    v.id === venueFixture.id ? { ...v, channel: value } : v,
                  ),
                }));
              }}
            />
            -{venueFixture.channel + fixture.channelFunctions.length - 1}
          </div>
        </div>
      }
      venueFixture={venueFixture}
    />
  );
};
