import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { Scene } from "../../../context/scenes";
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

export const SceneFrames = ({ scene }: { scene: New_GenericProfile[] }) => {
  const tableKeys = [
    ...scene.reduce((tableKeys, s) => {
      for (const key in s.state) {
        tableKeys.add(key as ChannelSimpleFunction);
      }
      return tableKeys;
    }, new Set<ChannelSimpleFunction>()),
  ];
  return (
    <table>
      <tbody>
        {tableKeys.map((key) => (
          <tr key={key}>
            <th>{key}</th>
            {scene.map((s, index) => (
              <td key={`${index}-${key}`}>{s.state[key]}</td>
            ))}
          </tr>
        ))}
        <tr>
          <th>Function</th>
          {scene.map((s, index) => (
            <td key={`${s.targetFunction}-${index}`}>{s.targetFunction}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
