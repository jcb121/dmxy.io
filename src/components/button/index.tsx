import styles from "./styles.module.scss";

export const Button = ({
  onClick,
  href,
  target,
  children,
  disabled,
}: {
  disabled?: React.ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  children: React.ReactNode;
}) => {
  if (href) {
    return (
      <button onClick={onClick} className={styles.button}>
        <a href={disabled ? undefined : href} target={target}>
          {children}
        </a>
      </button>
    );
  }

  return <button disabled={disabled} onClick={onClick}>{children}</button>;
};
