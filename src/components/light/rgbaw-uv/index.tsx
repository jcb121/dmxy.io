import styles from "./styles.module.scss";

export const RGBAWUV = () => {
  return (
    <div className={styles.root} data-testid="fixture">
      <div className={styles.inner}></div>
    </div>
  );
};
