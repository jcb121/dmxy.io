import { useEffect } from "react";
import { CycleScene as CycleSceneEvent } from "../../../context/events";
import { MidiCallback } from "../../../context/midi";
import { useScenes } from "../../../context/scenes";
import styles from "./styles.module.scss";
import { ButtonRow } from "../../buttons/button-row";
import { useTagsStore } from "../../stage/tags/tags";

export const CycleSceneEdit = ({
  onEventChange,
  payload,
  name,
}: {
  onEventChange: (s: CycleSceneEvent) => void;
  name: string;
  payload?: CycleSceneEvent;
}) => {
  const tags = useTagsStore((tags) => tags.tags["stage-fixture"]);
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
          scenes
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
      </select>

      <label>Tag modifier:</label>
      <select
        value={payload?.areaTag}
        onChange={(e) => {
          if (payload && e.target.value) {
            onEventChange({
              function: MidiCallback.cycleScene,
              cycleName: payload.cycleName,
              scenes: payload.scenes,
              areaTag: e.target.value,
            });
          }
        }}
      >
        <option value=""></option>
        {tags &&
          tags.map((tag) => (
            <option key={tag} value={`.${tag}`}>
              {tag}
            </option>
          ))}
      </select>

      <ButtonRow
        items={
          payload?.scenes?.map((id, index) => ({
            label: scenes.find((s) => s.id == id)?.name || "ERROR",
            index,
          })) || []
        }
        onClick={({ index }) => {
          if (!payload) return;

          payload.scenes?.splice(index);
          onEventChange({
            function: MidiCallback.cycleScene,
            cycleName: payload.cycleName,
            scenes: [...(payload.scenes || [])],
          });
        }}
      />
    </div>
  );
};
