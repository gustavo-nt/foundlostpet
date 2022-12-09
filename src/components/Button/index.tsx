import { ButtonHTMLAttributes } from "react";

import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
  size?: "sm" | "lg";
  variant?: "filled" | "outline";
}

export const Button = ({
  title,
  variant = "filled",
  size = "lg",
  loading = false,
  ...rest
}: ButtonProps) => (
  <button
    title={title}
    {...rest}
    data-size={size}
    data-variant={variant}
    className={styles.buttonContainer}
  >
    <span
      style={{
        opacity: loading ? 0 : 1,
      }}
    >
      {title}
    </span>
    {loading && <div className={styles.loaderContainer}></div>}
  </button>
);
