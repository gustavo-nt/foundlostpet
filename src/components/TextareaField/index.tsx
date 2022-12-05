import { TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  register?: any;
  errorMessage?: string;
}

export function TextareaField({
  label,
  errorMessage,
  register,
  ...rest
}: TextareaFieldProps) {
  return (
    <div className={styles.container}>
      {label && <label htmlFor={rest.name}>{label}</label>}

      <div className={styles.content}>
        <textarea {...rest} {...register}></textarea>
      </div>

      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
}
