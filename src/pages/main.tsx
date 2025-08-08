import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { useVenues } from "../context/venues";
import { useFixtures } from "../context/fixtures";
import { ListWithAction } from "../ui/list-with-actions";
import styles from "./main.module.scss";

const Main = () => {
  const venues = useVenues((state) => state.venues);
  const fixtures = useFixtures((state) => state.fixtures);

  return (
    <BasicPage>
      <div className={styles.root}>
        <div>
          <button>
            <a href={`/fixtures`} target="_blank">
              Fixures
            </a>
          </button>
          <ListWithAction
            items={fixtures.map((f) => ({ ...f, name: f.model }))}
            actions={[]}
          >
            {(item) => (
              <button>
                <a href={`/fixtures?fixture_id=${item.id}`} target="_blank">
                  edit
                </a>
              </button>
            )}
          </ListWithAction>
        </div>
        <div>
          <button>
            <a href={`/venues`} target="_blank">
              venues
            </a>
          </button>
          <ListWithAction items={venues} actions={[]}>
            {(item) => (
              <>
                <button>
                  <a href={`/venue?venue_id=${item.id}`} target="_blank">
                    edit
                  </a>
                </button>
                <button>
                  <a href={`/scene?venue_id=${item.id}`} target="_blank">
                    scenes
                  </a>
                </button>
                <button>
                  <a href={`/main?venue_id=${item.id}`} target="_blank">
                    open
                  </a>
                </button>
              </>
            )}
          </ListWithAction>
        </div>
      </div>
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
