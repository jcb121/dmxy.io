import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FixtureProvider } from "./context/fixtures.tsx";
import { VenueProvider } from "./context/venues.tsx";
import { ProfileProvier } from "./context/profiles.tsx";
import { MidiProvider } from "./context/midi.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <FixtureProvider>
      <ProfileProvier>
        <VenueProvider>
          <App />
        </VenueProvider>
      </ProfileProvier>
    </FixtureProvider>
  </MidiProvider>
  // </React.StrictMode>
);
