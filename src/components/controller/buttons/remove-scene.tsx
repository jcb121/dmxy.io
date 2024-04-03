import { useContext } from "react";
import { useGlobals } from "../../../context/globals";
// import { AttachMidiButton } from "../../attach-midi-button";
// import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { SceneContext } from "../../../context/scenes";
import styles from "../controller.module.scss";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import { removeScene as removeSceneEvent } from "../../../context/events";

export const RemoveScene = ({
  buttonId,
  editMode,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;

  editMode: boolean;
  payload?: removeSceneEvent;
  onEventChange: (s: removeSceneEvent) => void;
}) => {
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const removeScene = useGlobals((state) => state.handlers.removeScene);

  const { scenes } = useContext(SceneContext);

  const sceneName = scenes.find((s) => s.id === payload?.sceneId);

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;

  const onEventChange = (a: removeSceneEvent) => {
    if (midiTrigger) {
      setMidiTrigger(`${buttonId}_press`, {
        ...midiTrigger,
        payload: a,
      });
    }
    _onEventChange(a);
  };

  return (
    <div className={styles.root}>
      <button
        className={styles.mainButton}
        onClick={() => {
          payload?.sceneId && removeScene(payload);
        }}
      >
        {`Scene: ${sceneName?.name || "Empty"}`}
      </button>
      {editMode && (
        <select
          value={payload?.sceneId}
          onChange={(e) => {
            console.log(e.target.value);
            onEventChange({
              function: MidiCallback.removeScene,
              sceneId: e.target.value,
            });
          }}
        >
          <option value="">Select Scene</option>
          {scenes &&
            scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      )}
      {editMode && (
        <div>
          {/* <AttachMidiButton
            value={midiTriggers[`set_scene_${sceneId}`]}
            onMidiDetected={(midiTrigger) => {
              if (!sceneId) return;
              setMidiTrigger(`set_scene_${sceneId}`, {
                ...midiTrigger,
                callBack: MidiCallback.setScene,
                key: sceneId,
              });
            }}
            label="Attach Down"
          /> */}
          {/* <AttachMidiButton
            value={midiTriggers[`${sceneId}_up`]}
            onMidiDetected={(midiTrigger) => {
              if (!sceneId) return;
              setMidiTrigger(`${sceneId}_up`, {
                ...midiTrigger,
                type: MidiEventTypes.onRelease,
                callBack: MidiCallback.turnOff,
                key: sceneId,
              });
            }}
            label="Attach Release"
          /> */}
        </div>
      )}
    </div>
  );
};
