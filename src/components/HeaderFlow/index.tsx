import { NavLink } from "react-router-dom";
import { useLocationContext } from "../../contexts/LocationContext";

import { ArrowLeft, MapPin } from "phosphor-react";
import styles from "./styles.module.scss";

export function HeaderFlow() {
  const { geoLocation } = useLocationContext();

  return (
    <header className={styles.container}>
      <NavLink to="/">
        <ArrowLeft size={32} />
      </NavLink>

      <div className={styles.location}>
        <MapPin size={22} weight="fill" />
        <span>
          {geoLocation.city}, {geoLocation.ufCode}
        </span>
      </div>
    </header>
  );
}
