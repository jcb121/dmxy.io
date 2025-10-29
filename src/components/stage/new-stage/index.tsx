import { useRef } from "react";
import styles from "./styles.module.scss";

export const NewStage = ({
  onClick,
  children,
  onDrop,
}: {
  children?: React.ReactNode;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={onClick}
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
