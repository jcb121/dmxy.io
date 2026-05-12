import { ButtonRow } from "../../../components/buttons/button-row";
import { Fixture } from "../../../context/fixtures";
import { Scene } from "../../../context/scenes";
import styles from "./styles.module.scss";

export const SceneRules = ({
  scene,
  activeSelector,
  secondarySelector,
  setSecondarySelector,
  onClick,
  onDelete,
  fixtures = [],
}: {
  activeSelector: string | undefined;
  secondarySelector: string | undefined;
  setSecondarySelector: (selector: string | undefined) => void;
  onClick: (selector: string) => void;
  onDelete: (selector: string) => void;
  scene: Scene;
  fixtures?: Fixture[];
}) => {
  const fixtureMap = Object.fromEntries(fixtures.map((f) => [f.id, f.model]));

  const formatLabel = (selector: string) =>
    selector
      .split(" ")
      .map((token) =>
        token.startsWith("@") ? (fixtureMap[token.slice(1)] ?? token) : token,
      )
      .join(" ");

  const items = Object.keys(scene.new_profiles).map((selector) => {
    const label = formatLabel(selector);
    return {
      label: `${label} (${scene.new_profiles[selector].length})`,
      selector,
      active: selector === activeSelector,
      buttonProps: selector === secondarySelector
        ? ({ "data-secondary": "true" } as React.ButtonHTMLAttributes<HTMLButtonElement>)
        : undefined,
    };
  });

  return (
    <div data-testid="scene_rules">
      <ButtonRow
        items={items}
        onClick={({ selector }, e) => {
          if (e.shiftKey) {
            setSecondarySelector(selector === secondarySelector ? undefined : selector);
          } else {
            onClick(selector);
          }
        }}
      />
      <div className={styles.deleteRow}>
        {activeSelector && scene.new_profiles[activeSelector] && (
          <button className={styles.delete} onClick={() => onDelete(activeSelector)}>
            × Delete "{formatLabel(activeSelector)}"
          </button>
        )}
        {secondarySelector && scene.new_profiles[secondarySelector] && (
          <button className={styles.delete} onClick={() => onDelete(secondarySelector)}>
            × Delete "{formatLabel(secondarySelector)}"
          </button>
        )}
      </div>
    </div>
  );
};
