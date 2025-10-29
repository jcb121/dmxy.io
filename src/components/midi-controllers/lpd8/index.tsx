import { Layout } from "../../controller/controller";
import styles from "./styles.module.scss";

import {
  LPD8,
  // MPD218
} from "../../controller/controller-json";

export const LDP8Controller = ({
  onClick,
}: {
  onClick: (id: string) => void;
}) => {
  const [left, right] = (LPD8.type === "row" && LPD8.children) || [];

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div>
          <div className={styles.brand}>
            {[..."AKAI"].map((l, index) => (
              <span key={`${l}-${index}`}>{l}</span>
            ))}
          </div>
          <div className={styles.brand_subline}>
            {[..."Professional"].map((l, index) => (
              <span key={`${l}-${index}`}>{l}</span>
            ))}
          </div>
          <div className={styles.model}>
            {[..."LPD"].map((l, index) => (
              <span key={`${l}-${index}`}>{l}</span>
            ))}

            <span className={styles.number}>8</span>
          </div>

          <div className={styles.tagline}>Laptop pad controller</div>
        </div>

        {/* For later */}

        {/* <div className={styles.buttons}>
          <div className={styles.programButton}>
            PROGRAM
            <div className={styles.button}></div>
          </div>
          <div>
            NOTE
            <div className={styles.button}></div>
          </div>
          <div>
            PROG CHNG
            <div className={styles.button}></div>
          </div>
          <div>
            CC
            <div className={styles.button}></div>
          </div>
        </div> */}
      </div>

      <div className={styles.layout}>
        <Layout layout={left} id="LPD8" onClick={onClick} />
      </div>

      <div className={styles.layout}>
        <Layout layout={right} id="LPD8" onClick={onClick} />
      </div>
    </div>
  );
};
