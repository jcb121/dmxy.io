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
import { SetScene as SetSceneEvent } from "../../../context/events";

export const SetScene = ({
  buttonId,
  editMode,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  editMode: boolean;
  payload?: SetSceneEvent;
  onEventChange: (s: SetSceneEvent) => void;
}) => {
  const setScene = useGlobals((state) => state.handlers.setScene);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const { scenes } = useContext(SceneContext);
  const sceneName = scenes.find((s) => s.id === payload?.sceneId);

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: SetSceneEvent) => {
    if (midiTrigger) {
      setMidiTrigger(`${buttonId}_press`, {
        ...midiTrigger,
        payload: a,
      });
    }
    _onEventChange(a);
  };

  return (
    <div>
      <button
        className={styles.mainButton}
        onClick={() => {
          if (payload) setScene(payload);
          // sceneId && setGlobalValue("ActiveScene", [sceneId]);
        }}
      >
        {`Scene: ${sceneName?.name || "Empty"}`}
      </button>
      {editMode && (
        <div>
          <select
            value={payload?.sceneId}
            onChange={(e) => {
              console.log(e.target.value);
              onEventChange({
                sceneId: e.target.value,
                function: MidiCallback.setScene,
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
          <div></div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              console.log(midiTrigger);
              if (!payload) return;
              setMidiTrigger(`${buttonId}_press`, {
                ...midiTrigger,
                payload,
              });
            }}
            label="Attach Down"
          />
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_release`]}
            onMidiDetected={(midiTrigger) => {
              if (!payload) return;
              setMidiTrigger(`${buttonId}_release`, {
                ...midiTrigger,
                type: MidiEventTypes.onRelease,
                payload: {
                  ...payload,
                  function: MidiCallback.removeScene,
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
