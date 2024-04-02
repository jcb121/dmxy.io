import { useContext } from "react";
import { SceneContext } from "../../../context/scenes";
import styles from "../controller.module.scss";
import { useGlobals } from "../../../context/globals";
import {
  MidiCallback,
  MidiEventTypes,
  useMidiTriggers,
} from "../../../context/midi";
import { AttachMidiButton } from "../../attach-midi-button";

export const SetScene = ({
  buttonId,
  editMode,
  sceneId,
  setSceneId,
}: {
  buttonId: string;
  sceneId?: string;
  editMode: boolean;
  setSceneId: (s: string) => void;
}) => {
  const setScene = useGlobals((state) => state.handlers.setScene);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const { scenes } = useContext(SceneContext);
  const sceneName = scenes.find((s) => s.id === sceneId);

  return (
    <div>
      <button
        className={styles.mainButton}
        onClick={() => {
          setScene({
            function: MidiCallback.setScene,
            sceneId: sceneId,
          });
          // sceneId && setGlobalValue("ActiveScene", [sceneId]);
        }}
      >
        {`Scene: ${sceneName?.name || "Empty"}`}
      </button>
      {editMode && (
        <div>
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
          <div></div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              console.log(midiTrigger);
              if (!sceneId) return;
              setMidiTrigger(`${buttonId}_press`, {
                ...midiTrigger,
                payload: {
                  function: MidiCallback.setScene,
                  sceneId,
                },
              });
            }}
            label="Attach Down"
          />
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_release`]}
            onMidiDetected={(midiTrigger) => {
              if (!sceneId) return;
              setMidiTrigger(`${buttonId}_release`, {
                ...midiTrigger,
                type: MidiEventTypes.onRelease,
                payload: {
                  function: MidiCallback.removeScene,
                  sceneId,
                },
              });
            }}
            label="Attach Release"
          />
        </div>
      )}
    </div>
  );
};
