type ListItem = { name: string };

import styles from "./styles.module.scss";

export const ListWithAction = <T extends ListItem>({
  items,
  actions,
  children,
}: {
  children?: (item: T) => React.ReactNode;
  items: T[];
  actions: {
    disabled?: (i: T) => boolean;
    onClick?: (i: T) => void;
    name: string;
  }[];
}) => {
  return (
    <ul className={styles.root}>
      {items.map((item) => (
        <li className={styles.item} key={item.name}>
          <span className={styles.name}>{item.name}</span>

          {actions.map((a) => (
            <button
              disabled={a.disabled && a.disabled(item)}
              key={a.name}
              className={styles.button}
              onClick={() => a.onClick && a.onClick(item)}
            >
              {a.name}
            </button>
          ))}

          {children && children(item)}
        </li>
      ))}
    </ul>
  );
};
