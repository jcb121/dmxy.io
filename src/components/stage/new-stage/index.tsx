import { useRef } from "react";
import styles from "./styles.module.scss";

export const NewStage = ({
  // venue,
  children,
  onDrop,
}: {
  children?: React.ReactNode;
  // venue: Venue;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={styles.stage}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
};
