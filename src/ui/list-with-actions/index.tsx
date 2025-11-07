type ListItem = { name: string };

import { Button } from "../buttonLink";
import styles from "./styles.module.scss";

export const ListWithAction = <T extends ListItem>({
  items,
  actions,
  children,
  onClick,
}: {
  children?: (item: T) => React.ReactNode;
  items: T[];
  onClick?: (i: T) => void;

  actions: {
    disabled?: (i: T) => boolean;
    onClick?: (i: T) => void;
    name: string;
  }[];
}) => {
  return (
    <ul className={styles.root}>
      {items.map((item) => (
        <li
          className={styles.item}
          key={item.name}
          onClick={() => {
            onClick && onClick(item);
          }}
        >
          <span className={styles.name}>{item.name}</span>

          {actions.map((a) => (
            <Button
              disabled={a.disabled && a.disabled(item)}
              key={a.name}
              className={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                a.onClick && a.onClick(item);
              }}
            >
              {a.name}
            </Button>
          ))}

          {children && children(item)}
        </li>
      ))}
    </ul>
  );
};
