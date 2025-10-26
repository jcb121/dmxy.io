import { useRef, useState } from "react";
import styles from "./styles.module.scss";

export const PadButton = ({
  children,
  active,
  onClick,
  label,

  onMouseDown,
  onMouseUp,
  onHold,
}: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;

  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onHold?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const clicked = useRef(0);

  const [pressed, setPressed] = useState(false);

  const _active = pressed || active;

  return (
    <div className={styles.item}>
      {label && <div className={styles.label}>{label} </div>}
      <button
        onClick={onClick}
        className={styles.button}
        onMouseDown={(e) => {
          setPressed(true);
          clicked.current = e.timeStamp;
          onMouseDown && onMouseDown(e);
        }}
        onMouseUp={(e) => {
          setPressed(false);
          if (onHold && e.timeStamp - clicked.current > 1000) {
            onHold(e);
          } else {
            onMouseUp && onMouseUp(e);
          }
          e.timeStamp = 0;
        }}
        style={{
          boxShadow: _active
            ? "2px 2px 8px 0px #FF0000"
            : "2px 2px 0px 0px #404040ff",
        }}
      >
        {children}
      </button>
    </div>
  );
};
