import { GlobalTypes, useGlobals } from "../../../context/globals";
import { MidiEventTypes } from "../../../context/midi";
import { CycleScene as CycleSceneEvent } from "../../../context/events";
import { useScenes } from "../../../context/scenes";
import { PadButton } from "../../pad-button";
import { handleEvent } from "../../../domain/events";

export const CycleScene = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: CycleSceneEvent;
}) => {
  const scenes = useScenes((s) => s.scenes);

  const sAIVar = useGlobals((state) =>
    payload?.cycleName
      ? state.values[`_${payload.cycleName}_sceneAnimationIndexKey`]
      : undefined
  );

  const sceneIndex =
    sAIVar !== undefined && sAIVar.type === GlobalTypes.byte ? sAIVar.value : 0;

  const nextSceneId =
    payload?.scenes &&
    (payload.scenes[sceneIndex + 1] !== undefined
      ? payload.scenes[sceneIndex + 1]
      : payload.scenes[0]);

  return (
    <PadButton
      label={payload?.function}
      active={active}
      onMouseDown={() => {
        if (payload?.cycleName) handleEvent(payload, MidiEventTypes.onPress);
      }}
    >
      {`Next:`} {scenes.find((s) => s.id == nextSceneId)?.name}
    </PadButton>
  );
};
