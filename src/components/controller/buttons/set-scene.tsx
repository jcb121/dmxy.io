import { useScenes } from "../../../context/scenes";
import { MidiEventTypes } from "../../../context/midi";
import { SetScene as SetSceneEvent } from "../../../context/events";
import { PadButton } from "../../pad-button";
import { handleEvent } from "../../../domain/events";

export const SetScene = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: SetSceneEvent;
}) => {
  const scenes = useScenes((s) => s.scenes);
  const sceneName = scenes.find((s) => s.id === payload?.sceneId);

  return (
    <PadButton
      label={payload?.function}
      active={active}
      onMouseDown={() => {
        if (payload) handleEvent(payload, MidiEventTypes.onPress);
      }}
      onHold={() => {
        if (payload) handleEvent(payload, MidiEventTypes.onHoldRelease);
      }}
      onMouseUp={() => {
        if (payload) handleEvent(payload, MidiEventTypes.onRelease);
      }}
    >
      {`Scene: ${sceneName?.name || "Empty"}`}
    </PadButton>
  );
};
