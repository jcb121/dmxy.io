import styles from "./styles.module.scss";
import { Header } from "../header/index.tsx";
import { Button } from "../buttonLink/index.tsx";

export const BasicPage = ({
  children,
  left,
  header,
  headerRight,
  back,
}: {
  children?: React.ReactNode;
  left?: React.ReactNode;
  header?: React.ReactNode;
  headerRight?: React.ReactNode;
  back?: string;
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Header
          left={
            <>
              {back && (
                <Button onClick={() => (window.location.href = back)}>
                  Back
                </Button>
              )}
              {header}
            </>
          }
          right={headerRight}
        />
      </div>
      {left && <div className={styles.left}>{left}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
