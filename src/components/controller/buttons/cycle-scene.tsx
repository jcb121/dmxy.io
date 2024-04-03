import { useContext } from "react";
import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, useMidiTriggers } from "../../../context/midi";
import styles from "../controller.module.scss";
import { SceneContext } from "../../../context/scenes";
import { CycleScene as CycleSceneEvent } from "../../../context/events";
import { AttachMidiButton } from "../../attach-midi-button";

export const CycleScene = ({
  buttonId,
  editMode,
  payload,
  onEventChange: _onEventChange,
}: {
  buttonId: string;
  editMode: boolean;
  payload?: CycleSceneEvent;
  onEventChange: (s: CycleSceneEvent) => void;
}) => {
  const cycleScene = useGlobals((state) => state.handlers.cycleScene);
  const { scenes } = useContext(SceneContext);
  const midiTriggers = useMidiTriggers((state) => state.midiTriggers);
  const setMidiTrigger = useMidiTriggers((state) => state.setMidiTrigger);

  const sAIVar = useGlobals((state) =>
    payload?.cycleName
      ? state.values[`_${payload.cycleName}_sceneAnimationIndexKey`]
      : undefined
  );

  const sceneIndex =
    sAIVar !== undefined && sAIVar.type === GlobalTypes.byte ? sAIVar.value : 0;

  const currentSceneId =
    (payload && payload.scenes && payload.scenes[sceneIndex]) || undefined;

  const nextSceneId =
    payload?.scenes &&
    (payload.scenes[sceneIndex + 1] !== undefined
      ? payload.scenes[sceneIndex + 1]
      : payload.scenes[0]);

  const midiTrigger = buttonId ? midiTriggers[`${buttonId}_press`] : undefined;
  const onEventChange = (a: CycleSceneEvent) => {
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
          if (payload?.cycleName) cycleScene(payload);
        }}
      >
        <div>
          {`Current scene:`} {scenes.find((s) => s.id == currentSceneId)?.name}
        </div>
        <div>
          {`Nextscene:`} {scenes.find((s) => s.id == nextSceneId)?.name}
        </div>
      </button>
      {editMode && (
        <div>
          <div>
            Cycle name:
            <input
              value={payload?.cycleName || ""}
              onChange={(e) => {
                onEventChange({
                  function: MidiCallback.cycleScene,
                  cycleName: e.target.value,
                  scenes: payload?.scenes ? payload.scenes : [],
                });
              }}
            />
          </div>
          <select
            value=""
            onChange={(e) => {
              const found = scenes.find((s) => s.id === e.target.value);

              if (payload && payload?.scenes && found) {
                onEventChange({
                  function: MidiCallback.cycleScene,
                  cycleName: payload.cycleName,
                  scenes: [...payload.scenes, found.id],
                });
              }
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
          <div>
            {payload?.scenes?.map((sId, index) => (
              <button
                key={sId}
                onClick={() => {
                  if (payload)
                    onEventChange({
                      function: MidiCallback.cycleScene,
                      cycleName: payload.cycleName,
                      scenes: payload.scenes.splice(index - 1, 1),
                    });
                }}
              >
                {scenes.find((s) => s.id == sId)?.name}
              </button>
            ))}
          </div>
          <AttachMidiButton
            value={midiTriggers[`${buttonId}_press`]}
            onMidiDetected={(midiTrigger) => {
              if (payload)
                setMidiTrigger(`${buttonId}_press`, {
                  ...midiTrigger,
                  payload: {
                    function: MidiCallback.cycleScene,
                    scenes: payload.scenes,
                    cycleName: payload.cycleName,
                  },
                });
            }}
            label="Attach Down"
          />
        </div>
      )}
    </div>
  );
};
