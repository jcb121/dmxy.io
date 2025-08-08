import ReactDOM from "react-dom/client";
import "../index.css";
import {
  Fixture,
  FixtureProvider,
  FixtureShape,
  useFixtures,
} from "../context/fixtures.tsx";
import { VenueProvider } from "../context/venues.tsx";
import { ProfileProvier } from "../context/profiles.tsx";
import { MidiProvider } from "../context/midi.tsx";
import { useState } from "react";
import { CreateFixture } from "../domain/fixtures/createFixture/index.tsx";
import { BasicPage } from "../ui/layout/basic-page.tsx";
import { ListWithAction } from "../ui/list-with-actions/index.tsx";

const BASIC_FIXTURE: Fixture = {
  id: "DEFAULT",
  model: "",
  channelFunctions: [],
  fixtureShape: FixtureShape.square,
};

const FixturesPage = () => {
  const { fixtures, add, update, remove } = useFixtures();

  const [fixture, setFixture] = useState<Fixture>(BASIC_FIXTURE);

  return (
    <BasicPage
      left={
        <>
          <h2>Saved</h2>
          <ListWithAction
            items={fixtures.map((f) => ({ ...f, name: f.model }))}
            actions={[
              {
                name: "edit",
                onClick: setFixture,
              },
              {
                name: "remove",
                onClick: remove,
              },
            ]}
          />
        </>
      }
    >
      <CreateFixture
        fixture={fixture}
        onChange={setFixture}
        onSubmit={() => {
          const existst = fixtures.find((f) => f.id == fixture.id);
          if (existst) {
            update({
              ...fixture,
            });
          } else {
            add({
              ...fixture,
              id: crypto.randomUUID(),
            });
          }
        }}
      />
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <FixtureProvider>
      <ProfileProvier>
        <VenueProvider>
          <FixturesPage />
        </VenueProvider>
      </ProfileProvier>
    </FixtureProvider>
  </MidiProvider>
  // </React.StrictMode>
);
