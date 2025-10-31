import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { VenueProvider } from "./context/venues.tsx";
import { MidiProvider } from "./context/midi.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <VenueProvider>
      <App />
    </VenueProvider>
  </MidiProvider>
  // </React.StrictMode>
);
