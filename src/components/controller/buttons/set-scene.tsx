import { useScenes } from "../../../context/scenes";
import { useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { SetScene as SetSceneEvent } from "../../../context/events";
import { BaseButton } from "./base-button";
import styles from "../controller.module.scss";

export const SetScene = ({
  active,
  editMode,
  payload,
  onEventChange,
}: {
  active?: boolean;
  editMode: boolean;
  payload?: SetSceneEvent;
  onEventChange: (s: SetSceneEvent) => void;
}) => {
  const setScene = useGlobals((state) => state.handlers.setScene);
  const scenes = useScenes((s) => s.scenes);
  const sceneName = scenes.find((s) => s.id === payload?.sceneId);

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          if (payload) setScene(payload, MidiEventTypes.onPress);
        }}
      >
        <div className={styles.noWrap}>
          {`Scene: ${sceneName?.name || "Empty"}`}
        </div>
      </BaseButton>
      {editMode && (
        <div>
          <label>
            Remove{" "}
            <input
              type="checkbox"
              onChange={(e) => {
                onEventChange({
                  remove: e.target.checked,
                  sceneId: payload?.sceneId,
                  function: MidiCallback.setScene,
                });
              }}
              checked={payload?.remove}
            />
          </label>
          <select
            value={payload?.sceneId}
            onChange={(e) => {
              onEventChange({
                remove: payload?.remove || false,
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
        </div>
      )}
    </>
  );
};
