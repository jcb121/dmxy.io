// import { MidiTrigger } from "../../context/midi";
// import { AttachMidiButton } from "../attach-midi-button";
import styles from "./controller.module.scss";
import { MidiCallback } from "../../context/midi";
import { Tempo } from "./buttons/tempo";
import { SetScene } from "./buttons/set-scene";
import { SetColour as SetColourButton } from "./buttons/set-colour";
import { RemoveScene } from "./buttons/remove-scene";
import { SetState as SetStateButton } from "./buttons/set-state";
import { SetColour as SetColourKnob } from "./knobs/set-color";
import { SetState as SetStateKnob } from "./knobs/set-state";
import { UserEvent, useEvents } from "../../context/events";
import { Empty } from "./knobs/empy";
import { useEffect } from "react";
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
  // const globalFuncs = useGlobals((state) => state.functions);

  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);
  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const editMode = useEvents((state) => state.editMode);
  const setEditMode = useEvents((state) => state.setEditMode);

  useEffect(() => {
    console.log("buttonFuncs", buttonFuncs);
  }, [buttonFuncs]);

  // const midiTriggers = useGlobals((state) => state.midiTriggers);

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
                          setGlobalVar={(globalVar) => {
                            setButtonFuncs(id, {
                              timeStamp: undefined,
                              globalVar,
                              function: MidiCallback.setBeatLength,
                            });
                          }}
                          globalVar={buttonFunc.globalVar}
                          // midiTriggerName={`button_${id}`}
                          editMode={editMode}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setScene && (
                        <SetScene
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          setSceneId={(sceneId) => {
                            setButtonFuncs(id, {
                              sceneId: sceneId,
                              function: MidiCallback.setScene,
                            });
                          }}
                          sceneId={buttonFunc.sceneId}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.removeScene && (
                        <RemoveScene
                          editMode={editMode}
                          setSceneId={(sceneId) => {
                            setButtonFuncs(id, {
                              sceneId: sceneId,
                              function: MidiCallback.removeScene,
                            });
                          }}
                          sceneId={buttonFunc.sceneId}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setColour && (
                        <SetColourButton
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          colour={buttonFunc.colour}
                          setColour={(colour) => {
                            setButtonFuncs(id, {
                              colour,
                              function: MidiCallback.setColour,
                            });
                          }}
                        />
                      )}

                      {buttonFunc?.function === MidiCallback.setState && (
                        <SetStateButton
                          buttonId={`_button_${id}`}
                          editMode={editMode}
                          payload={buttonFunc.payload}
                          globalVar={buttonFunc.globalVar}
                          setValue={(globalVar, payload) => {
                            if (payload)
                              setButtonFuncs(id, {
                                payload,
                                globalVar: globalVar || undefined,
                                function: MidiCallback.setState,
                              });
                          }}
                        />
                      )}

                      {!buttonFuncs[id]?.function && (
                        <button className={styles.mainButton}>Empty</button>
                      )}

                      {/* <div className={styles.square}>
  <button className={styles.button}>Press</button>
  </div> */}

                      {/* <AttachMidiButton onMidiDetected={e => {
  console.log(e)
  }}
  /> */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* <AttachMidiButton label="Detect Knob" onMidiDetected={e => {
          console.log(e)
        }} /> */}

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
                        // value={buttonFunc.value}
                        globalVar={buttonFunc.globalVar}
                        setValue={(globalVar, payload) => {
                          setButtonFuncs(id, {
                            payload,
                            globalVar: globalVar || undefined,
                            function: MidiCallback.setState,
                          });
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
