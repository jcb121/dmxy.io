import styles from "./controller.module.scss";
import { MidiCallback, useMidiTriggers } from "../../context/midi";
import { Tempo } from "./buttons/tempo";
import { SetScene } from "./buttons/set-scene";
import { SetColour as SetColourButton } from "./buttons/set-colour";
import { RemoveScene } from "./buttons/remove-scene";
import { SetState as SetStateButton } from "./buttons/set-state";
import { CycleScene } from "./buttons/cycle-scene";
import { SetColour as SetColourKnob } from "./knobs/set-color";
import { SetState as SetStateKnob } from "./knobs/set-state";
import { UserEvent, useEvents } from "../../context/events";
import { Empty } from "./knobs/empy";
import { ToggleColour } from "./buttons/toggle-colour";
import { SetRenderMode } from "./buttons/set-render-mode";
import { ChangeZone } from "./buttons/change-zone";
import { AttachMidiButton } from "../attach-midi-button";
import { useGlobals } from "../../context/globals";
import { BaseButton } from "./buttons/base-button";
import { LPD8, MPD218 } from "./controller-json";

export type Layout =
  | {
      type: "row" | "column";
      children: Layout[];
      flex?: number;
    }
  | {
      type: "button" | "dial";
      id: number | string;
      flex?: number;
    };

export const Layout = ({ layout, id }: { id: string; layout: Layout }) => {
  return (
    <div
      className={styles[layout.type]}
      style={{
        flex: layout.flex || undefined,
      }}
    >
      {/* {layout.type} */}
      {layout.type == "row" &&
        layout.children.map((child, index) => (
          <Layout key={index} layout={child} id={id} />
        ))}

      {layout.type == "column" &&
        layout.children.map((child, index) => (
          <Layout key={index} layout={child} id={id} />
        ))}

      {layout.type === "button" && (
        <ControllerButton id={`_${id}_button_${layout.id}`} />
      )}

      {layout.type === "dial" && (
        <ControllerDial id={`_${id}_dial_${layout.id}`} />
      )}
    </div>
  );
};

export const ControllerButton = ({ id }: { id: string }) => {
  const editMode = useEvents((state) => state.editMode);
  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = buttonFuncs[id];

  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  const z = useGlobals((state) => state.values[id]);

  const active = z?.type == "byte" && z.value > 0;

  return (
    <>
      {editMode && (
        <div>
          <div>Select funcion</div>
          <select
            value={buttonFunc?.function}
            onChange={(e) => {
              setButtonFuncs(id, {
                function: e.target.value as MidiCallback,
              } as UserEvent);
            }}
          >
            <option></option>
            {Object.values(MidiCallback).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      {buttonFunc?.function === MidiCallback.setBeatLength && (
        <Tempo
          active={active}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
          editMode={editMode}
        />
      )}

      {buttonFunc?.function === MidiCallback.setScene && (
        <SetScene
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.removeScene && (
        <RemoveScene
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.playColour && (
        <SetColourButton
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.toggleColour && (
        <ToggleColour
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.setRenderMode && (
        <SetRenderMode
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.changeZone && (
        <ChangeZone
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.setState && (
        <SetStateButton
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.cycleScene && (
        <CycleScene
          active={active}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {!buttonFuncs[id]?.function && <BaseButton active={active} />}

      {editMode && (
        <div>
          <AttachMidiButton
            value={midiTriggers[id]}
            onMidiDetected={(midiTrigger) => setMidiTrigger(id, midiTrigger)}
            label="Attach Button"
          />
        </div>
      )}
    </>
  );
};

export const ControllerDial = ({ id }: { id: string }) => {
  const editMode = useEvents((state) => state.editMode);
  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = buttonFuncs[id];

  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  return (
    <>
      {editMode && (
        <div>
          <div>Select funcion</div>
          <select
            value={buttonFunc?.function}
            onChange={(e) => {
              setButtonFuncs(id, {
                function: e.target.value as MidiCallback,
              } as UserEvent);
            }}
          >
            <option></option>
            {Object.values(MidiCallback).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      {!buttonFunc?.function && <Empty buttonId={id} editMode={editMode} />}

      {buttonFunc?.function === MidiCallback.setColour && (
        <SetColourKnob
          buttonId={id}
          editMode={editMode}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}

      {buttonFunc?.function === MidiCallback.setState && (
        <SetStateKnob
          buttonId={id}
          payload={buttonFunc}
          onEventChange={(payload) => {
            if (payload) setButtonFuncs(id, payload);
          }}
        />
      )}
      {editMode && (
        <div>
          <AttachMidiButton
            value={midiTriggers[id]}
            onMidiDetected={(midiTrigger) => {
              console.log("GOT DIAL", midiTrigger);
              setMidiTrigger(id, midiTrigger);
            }}
            label={"Attach Knob"}
          />
        </div>
      )}
    </>
  );
};

export const Controller = () => {
  const editMode = useEvents((state) => state.editMode);
  const setEditMode = useEvents((state) => state.setEditMode);

  return (
    <div>
      <button onClick={() => setEditMode(!editMode)}>EditMode</button>
      <div className={styles.root}>
        <h1>MPC</h1>
        <div className={styles.controller}>
          <Layout layout={MPD218} id="MPC" />
        </div>

        <h1>LPD8</h1>
        <div className={styles.controller}>
          <Layout layout={LPD8} id="LPD8" />
        </div>
      </div>
    </div>
  );
};
