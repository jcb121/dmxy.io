import styles from "./styles.module.scss";

export const Header = ({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) => {
  return (
    <div className={styles.header}>
      {left}
      <span className={styles.spacer}></span>
      {right}
    </div>
  );
};
