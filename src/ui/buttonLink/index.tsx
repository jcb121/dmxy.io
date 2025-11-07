import styles from "./styles.module.scss";

export const ButtonLink = ({
  children,
  href,
  target,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={href} target={target}>
      <Button {...props}>{children}</Button>;
    </a>
  );
};

export const Button = ({
  children,
  primary,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  primary?: boolean;
}) => {
  return (
    <button {...props} className={styles.button} data-primary={primary}>
      {children}
    </button>
  );
};


export const IconButton = ({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  primary?: boolean;
}) => {
  return (
    <button {...props} className={styles.button} data-icon={true}>
      {children}
    </button>
  );
};
