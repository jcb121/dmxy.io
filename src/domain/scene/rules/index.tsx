import { Scene } from "../../../context/scenes";
import { SceneFrames } from "./frame";
import styles from "./styles.module.scss";

export const SceneRules = ({
  scene,
  setScene,
  onClick,
}: {
  onClick: (selector: string) => void;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  scene: Scene;
}) => {
  return (
    <div className={styles.root}>
      {Object.keys(scene.new_profiles).map((selector) => (
        <div
          key={selector}
          className={styles.rule}
          onClick={() => {
            onClick(selector);
          }}
        >
          <div className={styles.header}>
            <div className={styles.sceneName}>{selector}</div>
            <button
              className={styles.delete}
              onClick={() => {
                setScene((state) => {
                  const new_profiles = { ...state.new_profiles };
                  delete new_profiles[selector];
                  return { ...state, new_profiles };
                });
              }}
            >
              🗑
            </button>
          </div>
          <div className={styles.row}>
            <SceneFrames scene={scene.new_profiles[selector]} />
          </div>
        </div>
      ))}
    </div>
  );
};

