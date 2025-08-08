import { useGlobals } from "../../../context/globals";
import { useScenes } from "../../../context/scenes";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { removeScene as removeSceneEvent } from "../../../context/events";
import { BaseButton } from "./base-button";

export const RemoveScene = ({
  active,
  editMode,
  payload,
  onEventChange,
}: {
  active?: boolean;
  editMode: boolean;
  payload?: removeSceneEvent;
  onEventChange: (s: removeSceneEvent) => void;
}) => {
  const removeScene = useGlobals((state) => state.handlers.removeScene);

  const scenes = useScenes(s => s.scenes);

  const sceneName = scenes.find((s) => s.id === payload?.sceneId);

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          payload?.sceneId && removeScene(payload, MidiEventTypes.onPress);
        }}
      >
        {`Scene: ${sceneName?.name || "Empty"}`}
      </BaseButton>
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
    </>
  );
};
