import styles from "./styles.module.scss";
import { Header } from "../header/index.tsx";

export const BasicPage = ({
  children,
  left,
  header,
  headerRight,
}: {
  children?: React.ReactNode;
  left?: React.ReactNode;
  header?: React.ReactNode;
  headerRight?: React.ReactNode;
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Header left={header} right={headerRight} />
      </div>
      {left && <div className={styles.left}>{left}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
