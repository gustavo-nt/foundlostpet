import { InputHTMLAttributes, useCallback } from "react";
import styles from "./styles.module.scss";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: any;
  errorMessage?: string;
  icon?: React.ComponentType<any>;
  handleFieldValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({
  icon: Icon,
  handleFieldValue,
  errorMessage,
  register,
  label,
  ...rest
}: InputFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFieldValue && handleFieldValue(e);
    },
    [handleFieldValue],
  );

  return (
    <div className={styles.container}>
      {label && <label htmlFor={rest.name}>{label}</label>}

      <div className={styles.content} data-icon={!!Icon}>
        <input
          {...rest}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          {...register}
        />
        {Icon && <Icon size={20} />}
      </div>

      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
}
