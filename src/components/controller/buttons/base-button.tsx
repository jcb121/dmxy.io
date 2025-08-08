import { useRef } from "react";
import styles from "../controller.module.scss";

export const BaseButton = ({
  active,
  children,
  onMouseDown,
  onMouseUp,
  onHold,
  style,
}: {
  style?: React.CSSProperties;
  active?: boolean;
  children?: React.ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onHold?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const clicked = useRef(0);

  return (
    <button
      style={style}
      onMouseDown={(e) => {
        clicked.current = e.timeStamp;
        onMouseDown && onMouseDown(e);
      }}
      onMouseUp={(e) => {
        if (onHold && e.timeStamp - clicked.current > 1000) {
          onHold(e);
        } else {
          onMouseUp && onMouseUp(e);
        }
        e.timeStamp = 0;
      }}
      className={`${styles.mainButton} ${active && styles.active}`}
    >
      <div className={styles.content}>{children || "Empty"}</div>
    </button>
  );
};
