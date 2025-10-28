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
}: {
  venueFixture: VenueFixture;
  activeVenueFixtureId?: string;
  setVenue: React.Dispatch<React.SetStateAction<Venue>>;
  setActiveVenueFixtureId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}) => {
  const fixture = useFixtures((state) =>
    state.fixtures.find((f) => f.id === venueFixture.fixtureId)
  );
  if (!fixture) return;

  return (
    <NewStageFixture
      key={venueFixture.id}
      onDrag={(e) => {
        e.dataTransfer.setData("id", venueFixture.id);
      }}
      info={
        <div className={styles.root}>
          <div title={`(ch: ${fixture.channelFunctions.length})`}>
            {`${fixture.model}`}
          </div>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                setActiveVenueFixtureId(venueFixture.id);
              }}
            >
              {activeVenueFixtureId === venueFixture?.id ? "Active" : "Select"}
            </button>

            <button
              onClick={() => {
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.filter(
                    (v) => v.id !== venueFixture.id
                  ),
                }));
              }}
            >
              Remove
            </button>
          </div>

          <div>
            <Tags
              selector="stage-fixture"
              tags={venueFixture.tags}
              updateTags={(tags) => {
                const _tags = new Set(tags);
                setVenue((venue) => ({
                  ...venue,
                  venueFixtures: venue.venueFixtures.map((v) =>
                    v.id === venueFixture.id ? { ...v, tags: [..._tags] } : v
                  ),
                }));
              }}
            />
          </div>

          <div className={styles.channel}>
            <label prefix="">
              Uni:
            </label>
              <input
                className={styles.input}
                type="number"
                value={venueFixture.universe || 0}
                onChange={(e) => {
                  setVenue((venue) => ({
                    ...venue,
                    venueFixtures: venue.venueFixtures.map((v) =>
                      v.id === venueFixture.id
                        ? { ...v, universe: parseInt(e.target.value) }
                        : v
                    ),
                  }));
                }}
              />
            <label>
              CH:
            </label>
              <input
                className={styles.input}
                type="number"
                value={venueFixture.channel}
                onChange={(e) => {
                  setVenue((venue) => ({
                    ...venue,
                    venueFixtures: venue.venueFixtures.map((v) =>
                      v.id === venueFixture.id
                        ? { ...v, channel: parseInt(e.target.value) }
                        : v
                    ),
                  }));
                }}
              />
            -{venueFixture.channel + fixture.channelFunctions.length}
          </div>
        </div>
      }
      venueFixture={venueFixture}
    />
  );
};
