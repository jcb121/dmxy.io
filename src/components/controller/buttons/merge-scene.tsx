import { useScenes } from "../../../context/scenes";
import { MergeScene as MergeSceneEvent } from "../../../context/events";

import { MidiEventTypes } from "../../../context/midi";
import { PadButton } from "../../pad-button";
import { handleEvent } from "../../../domain/events";

export const MergeScene = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: MergeSceneEvent;
}) => {
  const scenes = useScenes((s) => s.scenes);

  const scene = scenes.find((s) => s.id == payload?.scene);

  return (
    <PadButton
      label={payload?.function}
      active={active}
      onMouseDown={() => {
        payload && handleEvent(payload, MidiEventTypes.onPress);
      }}
      onHold={() => {
        payload && handleEvent(payload, MidiEventTypes.onHoldRelease);
      }}
      onMouseUp={() => {
        payload && handleEvent(payload, MidiEventTypes.onRelease);
      }}
    >
      <div>Merge: {scene?.name}</div>
    </PadButton>
  );
};
