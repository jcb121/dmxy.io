import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MidiProvider } from "./context/midi.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <App />
  </MidiProvider>
  // </React.StrictMode>
);
