import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../../context/midi";
import { CycleScene as CycleSceneEvent } from "../../../context/events";
import { BaseButton } from "./base-button";
import styles from '../controller.module.scss'
import { useScenes } from "../../../context/scenes";

export const CycleScene = ({
  active,
  editMode,
  payload,
  onEventChange,
}: {
  active?: boolean;
  editMode: boolean;
  payload?: CycleSceneEvent;
  onEventChange: (s: CycleSceneEvent) => void;
}) => {
  const cycleScene = useGlobals((state) => state.handlers.cycleScene);
  const scenes = useScenes(s => s.scenes);

  const sAIVar = useGlobals((state) =>
    payload?.cycleName
      ? state.values[`_${payload.cycleName}_sceneAnimationIndexKey`]
      : undefined
  );

  const sceneIndex =
    sAIVar !== undefined && sAIVar.type === GlobalTypes.byte ? sAIVar.value : 0;

  // const currentSceneId =
  //   (payload && payload.scenes && payload.scenes[sceneIndex]) || undefined;

  const nextSceneId =
    payload?.scenes &&
    (payload.scenes[sceneIndex + 1] !== undefined
      ? payload.scenes[sceneIndex + 1]
      : payload.scenes[0]);

  return (
    <>
      <BaseButton
        active={active}
        onMouseDown={() => {
          if (payload?.cycleName) cycleScene(payload, MidiEventTypes.onPress);
        }}
      >
        {/* <div>
          {`Current scene:`} {scenes.find((s) => s.id == currentSceneId)?.name}
        </div> */}
        <div className={styles.noWrap}>
          {`Next:`} {scenes.find((s) => s.id == nextSceneId)?.name}
        </div>
      </BaseButton>
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
        </div>
      )}
    </>
  );
};
