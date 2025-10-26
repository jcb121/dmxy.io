import { MidiCallback } from "../../../context/midi";
import { MergeScene as MergeSceneEvent } from "../../../context/events";
import { useScenes } from "../../../context/scenes";
import styles from "./styles.module.scss";

export const MergeSceneEdit = ({
  onEventChange,
  payload,
}: {
  onEventChange: (s: MergeSceneEvent) => void;
  payload?: MergeSceneEvent;
}) => {
  const scenes = useScenes((s) => s.scenes);
  return (
    <div className={styles.root}>
      <label>Select Scene:</label>
      <select
        value={payload?.scene}
        onChange={(e) => {
          onEventChange({
            ...payload,
            function: MidiCallback.mergeScene,
            scene: e.target.value,
          });
        }}
      >
        <option value="">None</option>
        {scenes &&
          scenes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
      </select>
    </div>
  );
};
