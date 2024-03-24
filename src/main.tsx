import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FixtureProvider } from "./context/fixtures.tsx";
import { VenueProvider } from "./context/venues.tsx";
import { SceneProvider } from "./context/scenes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FixtureProvider>
      <VenueProvider>
        <SceneProvider>
          <App />
        </SceneProvider>
      </VenueProvider>
    </FixtureProvider>
  </React.StrictMode>
);
