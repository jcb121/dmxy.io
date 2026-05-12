import styles from "./styles.module.scss";

export const ButtonRow = <
  T extends {
    active?: boolean;
    label: string;
    buttonProps?: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >;
  },
>({
  items,
  onClick,
  "data-testid": testid,
}: {
  "data-testid"?: string,
  items: T[];
  onClick: (i: T, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  return (
    <div className={styles.root} data-testid={testid}>
      {items.map((i) => (
        <button
          {...i.buttonProps}
          onClick={(e) => onClick(i, e)}
          key={i.label}
          className={`${styles.button} ${i.active ? styles.active : ""}`}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
};
