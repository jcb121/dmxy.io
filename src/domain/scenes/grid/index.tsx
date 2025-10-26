import { PadButton } from "../../../components/pad-button";
import { useActiveScene } from "../../../context/active-scene";
import { Scene } from "../../../context/scenes";
import styles from "./styles.module.scss";

export const SceneGrid = ({
  scenes,
  scene,
}: {
  scene?: Scene;
  scenes: Scene[];
}) => {
  const setActiveScenes = useActiveScene((state) => state.setActiveScenes);

  return (
    <div className={styles.root}>
      {scenes.map((s, index) => (
        <div key={s.name} className={styles.item}>
          <PadButton
            label={`SCENE ${index}`}
            active={s.id === scene?.id}
            onClick={() => {
              setActiveScenes([JSON.parse(JSON.stringify(s))]);
            }}
          >
            {s.name}
          </PadButton>
        </div>
      ))}
    </div>
  );
};
