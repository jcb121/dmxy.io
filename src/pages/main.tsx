import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { useVenues } from "../context/venues";
import { ListWithAction } from "../ui/list-with-actions";
import styles from "./main.module.scss";
import { registerUsbDevice } from "../context/dmx/usb";
import { registerSerialDevice } from "../context/dmx/serial";
import { PadButton } from "../components/pad-button";
import { Button } from "../ui/buttonLink";

const Main = () => {
  const venues = useVenues((state) => state.venues);

  return (
    <BasicPage
      header={
        <>
          <h2>Gig Lights</h2>
        </>
      }
      headerRight={
        <>
          <Button
            onClick={() => {
              registerUsbDevice();
            }}
          >
            Register USB DMX
          </Button>

          <Button
            onClick={() => {
              registerSerialDevice();
            }}
          >
            Register Serial DMX
          </Button>
        </>
      }
      left={
        <div className={styles.links}>
          <a href={`/controllers.html`}>Controllers</a>

          <a href={`/fixtures.html`}>Fixtures</a>

          <a href={`/venues.html`}>Venues</a>
          <p></p>
        </div>
      }
    >
      <div className={styles.root}>
        {venues.map((v) => (
          <a key={v.id} href={`/main.html?venue_id=${v.id}`} target="_blank">
            <PadButton label="Open Venue">{v.name}</PadButton>
          </a>
        ))}
      </div>
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
