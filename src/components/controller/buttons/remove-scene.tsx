import { useContext } from "react";
import { useGlobals } from "../../../context/globals";
// import { AttachMidiButton } from "../../attach-midi-button";
// import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { SceneContext } from "../../../context/scenes";
import styles from "../controller.module.scss";
import { MidiCallback } from "../../../context/midi";

export const RemoveScene = ({
  editMode,
  sceneId,
  setSceneId,
}: {
  sceneId?: string;
  editMode: boolean;
  setSceneId: (s: string) => void;
}) => {
  // const setMidiTrigger = useGlobals((state) => state.setMidiTrigger);
  // const midiTriggers = useGlobals((state) => state.midiTriggers);
  const removeScene = useGlobals((state) => state.handlers.removeScene);

  const { scenes } = useContext(SceneContext);

  const sceneName = scenes.find((s) => s.id === sceneId);

  return (
    <div className={styles.root}>
      <button
        className={styles.mainButton}
        onClick={() => {
          sceneId &&
            removeScene({
              function: MidiCallback.removeScene,
              sceneId: sceneId,
            });
        }}
      >
        {`Scene: ${sceneName?.name || "Empty"}`}
      </button>
      {editMode && (
        <select
          value={sceneId}
          onChange={(e) => {
            console.log(e.target.value);
            setSceneId(e.target.value);
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
