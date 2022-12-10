import { useNavigate } from "react-router-dom";
import { useLocationContext } from "../../hooks/location";

import { ArrowLeft, MapPin } from "phosphor-react";
import styles from "./styles.module.scss";

export function HeaderFlow() {
  const navigate = useNavigate();
  const { geoLocation } = useLocationContext();

  return (
    <header className={styles.container}>
      <div onClick={() => navigate(-1)}>
        <ArrowLeft size={32} />
      </div>

      <div className={styles.location}>
        <MapPin size={22} weight="fill" />
        <span>
          {geoLocation.city}, {geoLocation.ufCode}
        </span>
      </div>
    </header>
  );
}
