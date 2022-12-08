import { InputHTMLAttributes, useCallback } from "react";
import styles from "./styles.module.scss";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  errorMessage?: string;
  icon?: React.ComponentType<any>;
}

export function InputField({
  icon: Icon,
  errorMessage,
  register,
  label,
  ...rest
}: InputFieldProps) {
  return (
    <div className={styles.container}>
      {label && <label htmlFor={rest.name}>{label}</label>}

      <div className={styles.content} data-icon={!!Icon}>
        <input {...rest} {...register} />
        {Icon && <Icon size={20} />}
      </div>

      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
}
