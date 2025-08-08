import styles from "./styles.module.scss";
import { connect, startDMX } from "../../dmx.tsx";
import { Header } from "../header/index.tsx";

export const BasicPage = ({
  children,
  left,
  header,
}: {
  children?: React.ReactNode;
  left?: React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Header
          left={header}
          right={
            <button
              onClick={async () => {
                const port = await connect();
                if (port) {
                  // setPort(port);
                  startDMX(port);
                }
              }}
            >
              DMX Connect
            </button>
          }
        />
      </div>
      {left && <div className={styles.left}>{left}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};
