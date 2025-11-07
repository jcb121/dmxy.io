import styles from "./controller.module.scss";
import { MidiCallback } from "../../context/midi";
import { UserEvent, useEvents } from "../../context/events";
import { AttachMidiButton } from "../attach-midi-button";

import { useState } from "react";
import { CycleSceneEdit } from "./edit/cycle-scene";
import { MergeSceneEdit } from "./edit/merge-scene";
import { SetSceneEdit } from "./edit/set-scene";
import { TempoEdit } from "./edit/tempo";
import { SetVarEdit } from "./edit/set-var";
import { SetChannelValueEdit } from "./edit/set-channel-value";
import { useMidiTriggers } from "../../context/midi-triggers";
import { MPD218Controller } from "../midi-controllers/mpd218";
import { LDP8Controller } from "../midi-controllers/lpd8";
import { CustomController } from "../midi-controllers/custom-controller";
import { useActiveVenue } from "../../context/venues";

export const Controller = ({
  controller,
  onRemove,
}: {
  controller: string;
  onRemove: () => void;
}) => {
  const [id, setId] = useState<string>();
  const setButtonFuncs = useEvents((state) => state.setButtonFuncs);

  const editMode = useEvents((state) => state.editMode);
  const venueId = useActiveVenue((state) => state.venue?.id);

  const buttonFuncs = useEvents((state) => state.buttonFuncs);
  const buttonFunc =
    id && venueId && buttonFuncs[venueId]
      ? buttonFuncs[venueId][id]
      : undefined;
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  return (
    <div className={styles.root}>
      <div className={styles.controller}>
        {controller === "AKAI_LPD8" && (
          <LDP8Controller
            onClick={(id) => {
              setId(id);
            }}
          />
        )}

        {controller === "AKAI_MPD218" && (
          <MPD218Controller
            onClick={(id) => {
              setId(id);
            }}
          />
        )}

        {controller !== "AKAI_LPD8" && controller !== "AKAI_MPD218" && (
          <CustomController
            controllerId={controller}
            onClick={(id) => {
              setId(id);
            }}
          />
        )}
        {editMode && (
          <button className={styles.remove} onClick={onRemove}>
            Remove
          </button>
        )}
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
                  venueId &&
                    setButtonFuncs(venueId, id, {
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
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}
            {buttonFunc?.function === MidiCallback.mergeScene && (
              <MergeSceneEdit
                payload={buttonFunc}
                onEventChange={(payload) => {
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}

            {buttonFunc?.function === MidiCallback.setScene && (
              <SetSceneEdit
                payload={buttonFunc}
                onEventChange={(payload) => {
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}

            {buttonFunc?.function === MidiCallback.setBeatLength && (
              <TempoEdit
                payload={buttonFunc}
                onEventChange={(payload) => {
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}

            {buttonFunc?.function === MidiCallback.setVar && (
              <SetVarEdit
                payload={buttonFunc}
                onEventChange={(payload) => {
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}

            {buttonFunc?.function === MidiCallback.setChannelValue && (
              <SetChannelValueEdit
                payload={buttonFunc}
                onEventChange={(payload) => {
                  venueId && setButtonFuncs(venueId, id, payload);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
