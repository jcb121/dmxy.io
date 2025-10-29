import styles from "./controller.module.scss";
import { MidiCallback } from "../../context/midi";
import { Tempo } from "./buttons/tempo";
import { SetScene } from "./buttons/set-scene";
import { CycleScene } from "./buttons/cycle-scene";
import { UserEvent, useEvents } from "../../context/events";
import { Empty } from "./knobs/empty";
import { AttachMidiButton } from "../attach-midi-button";

import { MergeScene } from "./buttons/merge-scene";
import { PadButton } from "../pad-button";
import { SetVar } from "./knobs/set-var";
import { useState } from "react";
import { CycleSceneEdit } from "./edit/cycle-scene";
import { MergeSceneEdit } from "./edit/merge-scene";
import { SetSceneEdit } from "./edit/set-scene";
import { TempoEdit } from "./edit/tempo";
import { SetVarEdit } from "./edit/set-var";
import { SetChannelValueEdit } from "./edit/set-channel-value";
import { SetChannelValue } from "./knobs/set-channel-value.";
import { useMidiState } from "../../context/midi-state";
import { useMidiTriggers } from "../../context/midi-triggers";
import { MPD218Controller } from "../midi-controllers/mpd218";

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

export const Layout = ({
  layout,
  id,
  onClick,
}: {
  id: string;
  layout: Layout;
  onClick: (id: string) => void;
}) => {
  return (
    <div
      className={styles[layout.type]}
      style={{
        flex: layout.flex || undefined,
      }}
    >
      {layout.type == "row" &&
        layout.children.map((child, index) => (
          <Layout key={index} layout={child} id={id} onClick={onClick} />
        ))}

      {layout.type == "column" &&
        layout.children.map((child, index) => (
          <Layout key={index} layout={child} id={id} onClick={onClick} />
        ))}

      {layout.type === "button" && (
        <ControllerButton id={`_${id}_button_${layout.id}`} onClick={onClick} />
      )}

      {layout.type === "dial" && (
        <ControllerDial id={`_${id}_dial_${layout.id}`} onClick={onClick} />
      )}
    </div>
  );
};

export const ControllerButton = ({
  id,
  onClick,
}: {
  id: string;
  onClick: (id: string) => void;
}) => {
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = buttonFuncs[id];
  const buttonState = useMidiState((state) => state[id]);
  const active = buttonState > 0;

  return (
    <div
      className={styles.button}
      onClick={() => {
        onClick(id);
      }}
    >
      {buttonFunc?.function === MidiCallback.setBeatLength && (
        <Tempo active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.setScene && (
        <SetScene active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.mergeScene && (
        <MergeScene active={active} payload={buttonFunc} />
      )}

      {buttonFunc?.function === MidiCallback.cycleScene && (
        <CycleScene active={active} payload={buttonFunc} />
      )}

      {!buttonFuncs[id]?.function && (
        <PadButton label="Empty" active={active} />
      )}
    </div>
  );
};

export const ControllerDial = ({
  id,
  onClick,
}: {
  id: string;
  onClick: (id: string) => void;
}) => {
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = buttonFuncs[id];
  const dialValue = (useMidiState((state) => state[id]) || 0) * 2;

  return (
    <div
      onClick={() => {
        onClick(id);
      }}
    >
      {buttonFunc?.function == MidiCallback.setVar && (
        <SetVar payload={{ ...buttonFunc, value: dialValue }} />
      )}

      {buttonFunc?.function == MidiCallback.setChannelValue && (
        <SetChannelValue payload={{ ...buttonFunc, value: dialValue }} />
      )}

      {!buttonFunc?.function && (
        <Empty
          payload={{
            value: dialValue,
          }}
          onChange={(e) => {
            useMidiState.setState((state) => ({
              ...state,
              [id]: parseInt(e.target.value) / 2,
            }));
          }}
        />
      )}
    </div>
  );
};

export const Controller = () => {
  const [id, setId] = useState<string>();
  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc = id ? buttonFuncs[id] : undefined;
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  return (
    <div>
      <div className={styles.root}>
        {/* <button
          className={styles.editButton}
          style={{
            border: (editMode && "1px solid red") || undefined,
          }}
          onClick={() => setEditMode(!editMode)}
        >
          ⚙
        </button> */}
        {/* <h1>MPC</h1>
        <div className={styles.controller}>
          <Layout layout={MPD218} id="MPC" />
        </div> */}

        <div>
          {/* <LDP8Controller
            onClick={(id) => {
              setId(id);
            }}
          /> */}

          <MPD218Controller
            onClick={(id) => {
              setId(id);
            }}
          />
        </div>

        {id && (
          <div>
            <div className={styles.edit}>
              <div className={styles.header}>
                <h2>{id}</h2>
                <AttachMidiButton
                  value={midiTriggers[id]}
                  onMidiDetected={(midiTrigger) => {
                    setMidiTrigger(id, midiTrigger);
                  }}
                  label={"Attach"}
                />
              </div>

              <div className={styles.content}>
                <label>Function:</label>
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
              {buttonFunc?.function === MidiCallback.cycleScene && (
                <CycleSceneEdit
                  name={id}
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}
              {buttonFunc?.function === MidiCallback.mergeScene && (
                <MergeSceneEdit
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}

              {buttonFunc?.function === MidiCallback.setScene && (
                <SetSceneEdit
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}

              {buttonFunc?.function === MidiCallback.setBeatLength && (
                <TempoEdit
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}

              {buttonFunc?.function === MidiCallback.setVar && (
                <SetVarEdit
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}

              {buttonFunc?.function === MidiCallback.setChannelValue && (
                <SetChannelValueEdit
                  payload={buttonFunc}
                  onEventChange={(payload) => {
                    setButtonFuncs(id, payload);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
