import { useEffect } from "react";
import { CycleScene as CycleSceneEvent } from "../../../context/events";
import { MidiCallback } from "../../../context/midi";
import { useScenes } from "../../../context/scenes";
import styles from "./styles.module.scss";

export const CycleSceneEdit = ({
  onEventChange,
  payload,
  name,
}: {
  onEventChange: (s: CycleSceneEvent) => void;
  name: string;
  payload?: CycleSceneEvent;
}) => {
  useEffect(() => {
    if (!payload?.cycleName) {
      onEventChange({
        scenes: payload?.scenes || [],
        cycleName: name,
        function: MidiCallback.cycleScene,
      });
    }
  }, [payload, name, onEventChange]);

  const scenes = useScenes((s) => s.scenes);

  return (
    <div className={styles.root}>
      <label>Select Scene:</label>
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
      <div className={styles.span2}>
        {payload?.scenes?.map((sId, index) => (
          <button
            key={`${sId}-${index}`}
            onClick={() => {
              payload.scenes.splice(index);
              onEventChange({
                function: MidiCallback.cycleScene,
                cycleName: payload.cycleName,
                scenes: [...payload.scenes],
              });
            }}
          >
            {scenes.find((s) => s.id == sId)?.name}
          </button>
        ))}
      </div>
    </div>
  );
};
