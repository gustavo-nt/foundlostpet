import { TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextareaField({ label, ...rest }: TextareaFieldProps) {
  return (
    <div className={styles.container}>
      {label && <label htmlFor={rest.name}>{label}</label>}

      <div className={styles.content}>
        <textarea {...rest}></textarea>
      </div>
    </div>
  );
}
