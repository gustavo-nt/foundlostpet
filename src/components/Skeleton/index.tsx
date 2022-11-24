import styles from "./styles.module.scss";

export const Skeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.image} ${styles.skeletonBox}`}></div>
      <div className={`${styles.author} ${styles.skeletonBox}`}></div>

      <div className={`${styles.situation} ${styles.skeletonBox}`}></div>
      <div className={`${styles.name} ${styles.skeletonBox}`}></div>

      <div className={styles.description}>
        <div className={styles.skeletonBox}></div>
        <div className={styles.skeletonBox}></div>
      </div>

      <div className={`${styles.region} ${styles.skeletonBox}`}></div>

      <div className={styles.footer}>
        <div className={styles.skeletonBox}></div>
        <div className={styles.skeletonBox}></div>
      </div>
    </div>
  );
};
