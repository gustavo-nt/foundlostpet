import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface TagWithIconProps {
  icon: ReactNode;
  iconBg: string;
  text: string | ReactNode;
}

export function TagWithIcon({ icon, iconBg, text }: TagWithIconProps) {
  return (
    <div className={styles.container}>
      <div style={{ backgroundColor: iconBg }}>{icon}</div>
      <span>{text}</span>
    </div>
  );
}
