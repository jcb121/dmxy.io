import { IDBPDatabase, openDB } from "idb";
import { Fixture, FixtureProfile } from "./context/fixtures";
import { Scene } from "./context/scenes";
import { Venue } from "./context/venues";
import { GenericProfile } from "./context/profiles";

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    db = undefined;
  });
}

type MyDB = {
  // fixtures: Fixture,
  fixtures: {
    key: string;
    value: Fixture;
  };

  fixtureProfiles: {
    key: string;
    value: FixtureProfile;
  };

  genericProfiles: {
    key: string;
    value: GenericProfile;
  };
  scenes: {
    key: string;
    value: Scene;
  };

  venues: {
    key: string;
    value: Venue;
  };
};

let db: IDBPDatabase<MyDB> | undefined;

export const getDatabase = async (): Promise<IDBPDatabase<MyDB>> => {
  return db
    ? db
    : await openDB<MyDB>("keyval-store2", 5, {
        upgrade(db) {
          console.log("CREATING DB?");
          try {
            db.createObjectStore("venues", {
              keyPath: "id",
            });
          } catch (e) {
            //
          }
          try {
            db.createObjectStore("scenes", {
              keyPath: "id",
            });
          } catch (e) {
            //
          }
          try {
            db.createObjectStore("fixtures", {
              keyPath: "id",
            });
          } catch (e) {
            //
          }
          try {
            db.createObjectStore("fixtureProfiles", {
              keyPath: "id",
            });
          } catch (e) {
            //
          }
          try {
            db.createObjectStore("genericProfiles", {
              keyPath: "id",
            });
          } catch (e) {
            //
          }
        },
      });
};
