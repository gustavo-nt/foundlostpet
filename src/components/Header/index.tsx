import { Link, NavLink } from "react-router-dom";
import { useLocationContext } from "../../contexts/LocationContext";

import logo from "../../assets/logo-yellow.png";
import { MapPin, User } from "phosphor-react";

import styles from "./styles.module.scss";

export function Header() {
  const { geoLocation } = useLocationContext();

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <NavLink to="/">
          <img src={logo} alt="" />
        </NavLink>

        <div>
          <div className={styles.city}>
            <MapPin size={22} weight="fill" />
            <span>
              {geoLocation.city}, {geoLocation.ufCode}
            </span>
          </div>

          <Link to={"/signin"} className={styles.order}>
            <User size={22} weight="fill" />
          </Link>
        </div>
      </div>
    </header>
  );
}
