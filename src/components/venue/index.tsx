// import { useContext } from "react";
// import { FixtureContext } from "../../context/fixtures";
// import { Light } from "../light";
import styles from "./venue.module.scss";
// import { VenueContext } from "../../context/venues";

export const Venue = () => {
  // const { fixtures } = useContext(FixtureContext);
  // const { venues } = useContext(VenueContext);
  // const venue = venues[0];

  return (
    <div className={styles.root}>
      {/* <h4>Venue - {venue.name}</h4>
      {venue.venueFixtures.map((f) => {
        const fixture = fixtures.find((fixture) => fixture.id === f.fixtureId);
        if (!fixture) return null;
        return (
          <div className={styles.item} key={fixture.id}>
            <Light fixture={fixture}></Light>
            <span>
              {fixture?.model} - ch?
            </span>
          </div>
        );
      })} */}
    </div>
  );
};
