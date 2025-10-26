import { MidiCallback } from "../../../context/midi";
import { useScenes } from "../../../context/scenes";
import { SetScene as SetSceneEvent } from "../../../context/events";
import styles from "./styles.module.scss";

export const SetSceneEdit = ({
  onEventChange,
  payload,
}: {
  onEventChange: (s: SetSceneEvent) => void;
  payload?: SetSceneEvent;
}) => {
  const scenes = useScenes((s) => s.scenes);

  return (
    <div className={styles.root}>
      <label>Select Scene:</label>
      <select
        value={payload?.sceneId}
        onChange={(e) => {
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
    </div>
  );
};
