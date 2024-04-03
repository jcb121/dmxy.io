// import { MidiTrigger } from "../../context/midi";
// import { AttachMidiButton } from "../attach-midi-button";
import styles from "./controller.module.scss";
import { MidiCallback } from "../../context/midi";
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
// import { useEvents } from "../../context/events";
// import { SetColour } from "./knobs/set-color/set-color";

const BUTTONS = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
];
const KNOBS = [
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

export const Controller = () => {
  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const editMode = useEvents((state) => state.editMode);
  const setEditMode = useEvents((state) => state.setEditMode);

  return (
    <div>
      <button onClick={() => setEditMode(!editMode)}>EditMode</button>
      <div className={styles.root}>
        <div className={styles.left}>
          {BUTTONS.map((buttonRow, rowIndex) => {
            return (
              <div className={styles.row} key={rowIndex}>
                {buttonRow.map((id) => {
                  const buttonFunc = buttonFuncs[id];
                  return (
                    <div key={id} className={styles.item}>
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
                          buttonId={`_button_${id}`}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            if (payload) setButtonFuncs(id, payload);
                          }}
                          editMode={editMode}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setScene && (
                        <SetScene
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            if (payload) setButtonFuncs(id, payload);
                          }}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.removeScene && (
                        <RemoveScene
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            // this is the best way to do it...
                            if (payload) setButtonFuncs(id, payload);
                          }}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setColour && (
                        <SetColourButton
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            // this is the best way to do it...
                            if (payload) setButtonFuncs(id, payload);
                          }}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setState && (
                        <SetStateButton
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            // this is the best way to do it...
                            if (payload) setButtonFuncs(id, payload);
                          }}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.cycleScene && (
                        <CycleScene
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc}
                          onEventChange={(payload) => {
                            // this is the best way to do it...
                            if (payload) setButtonFuncs(id, payload);
                          }}
                        />
                      )}

                      {!buttonFuncs[id]?.function && (
                        <button className={styles.mainButton}>Empty</button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={styles.right}>
          {KNOBS.map((knowRow, rowIndex) => (
            <div className={styles.row} key={rowIndex}>
              {knowRow.map((id) => {
                const buttonFunc = buttonFuncs[id];

                return (
                  <div key={id} className={styles.item}>
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

                    {!buttonFunc?.function && (
                      <Empty buttonId={`_button_${id}`} editMode={editMode} />
                    )}

                    {buttonFunc?.function === MidiCallback.setColour && (
                      <SetColourKnob
                        buttonId={`_button_${id}`}
                        editMode={editMode}
                      />
                    )}

                    {buttonFunc?.function === MidiCallback.setState && (
                      <SetStateKnob
                        buttonId={`_button_${id}`}
                        payload={buttonFunc}
                        onEventChange={(payload) => {
                          // this is the best way to do it...
                          if (payload) setButtonFuncs(id, payload);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
