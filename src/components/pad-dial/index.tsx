import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { mapNumbers } from "../../utils";

export const PadDial = ({
  value,
  label,
  onChange,
}: {
  value: number;
  label: React.ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rotation = mapNumbers(0, 255, value || 0, -140, +140);

    ref.current?.style.setProperty("--Rotation", `${rotation}deg`);
  }, [value]);

  return (
    <div ref={ref}>
      <div className={styles.label}>{label}</div>
      <div className={styles.wrapper}>
        <div className={styles.dial} prefix=""></div>
      </div>
      <input
        className={styles.input}
        type="range"
        onChange={onChange}
        min={0}
        max={255}
      />
    </div>
  );
};
