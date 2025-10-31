import ReactDOM from "react-dom/client";
import "../index.css";
import { useVenues, VenueProvider } from "../context/venues.tsx";
import { MidiProvider } from "../context/midi.tsx";
import { BasicPage } from "../ui/layout/basic-page.tsx";
import { ListWithAction } from "../ui/list-with-actions/index.tsx";

const VenuesPage = () => {
  const venues = useVenues((state) => state.venues);
  const remove = useVenues((state) => state.remove);

  return (
    <BasicPage
      left={
        <>
          <h2>Saved</h2>
          <ListWithAction
            items={venues}
            actions={[
              {
                name: "edit",
                onClick: (v) => {
                  // @ts-expect-error this works
                  globalThis.open(`/venue?venue_id=${v.id}`, "_blank").focus();
                },
              },
              {
                name: "remove",
                onClick: remove,
              },
              {
                name: "open",
                onClick: (v) => {
                  // @ts-expect-error this works
                  globalThis.open(`/?venue_id=${v.id}`, "_blank").focus();
                },
              },
            ]}
          />
        </>
      }
    >
      <button
        onClick={() => {
          // @ts-expect-error this works
          globalThis.open(`/venue`, "_blank").focus();
        }}
      >
        Create Venue
      </button>
      {/* <CreateFixture
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
      /> */}
    </BasicPage>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MidiProvider>
    <VenueProvider>
      <VenuesPage />
    </VenueProvider>
  </MidiProvider>
  // </React.StrictMode>
);
