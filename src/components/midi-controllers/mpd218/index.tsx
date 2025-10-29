import { Layout } from "../../controller/controller";
import { MPD218 } from "../../controller/controller-json";
import styles from "./styles.module.scss";

export const MPD218Controller = ({
  onClick,
}: {
  onClick: (id: string) => void;
}) => {
  const [left, right] = (MPD218.type === "row" && MPD218.children) || [];

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.logo}>
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
        </div>
        <Layout id="MPD218" layout={left} onClick={onClick} />
        <div className={styles.buttons}>
          <div>A/B/C</div>
          <div></div>
          <div>A/B/C</div>

          <div>
            <div className={styles.button}></div>
            CTRL BANK
          </div>

          <div>
            <div className={styles.button}></div>
            PROG SELECT
          </div>

          <div>
            <div className={styles.button}></div>
            PAD BANK
          </div>

          <div>
            <div className={styles.button}></div>
            FULL LEVEL
          </div>

          <div>
            <div className={styles.button}></div>
            NR CONFIG
          </div>

          <div>
            <div className={styles.button}></div>
            NOTE REPEAT
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.model}>
          {[..."MPD"].map((l, index) => (
            <span key={`${l}-${index}`}>{l}</span>
          ))}

          <span className={styles.number}>218</span>
        </div>

        <div className={styles.pads}>
          <Layout id="MPD218" layout={right} onClick={onClick} />
        </div>
      </div>
    </div>
  );
};
