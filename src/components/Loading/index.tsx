import styles from "./styles.module.scss";

export const Loading = () => {
  return (
    <div
      className={`${styles.container} 'spin'`}
      aria-label="Processando..."
    ></div>
  );
};
