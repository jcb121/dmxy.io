// import { useContext } from "react";
// import { Light } from "../light";
import styles from "./venue.module.scss";

export const Venue = () => {

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
