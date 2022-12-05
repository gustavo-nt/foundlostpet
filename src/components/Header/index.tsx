import { Link, NavLink, useNavigate } from "react-router-dom";
import { MapPin, User, SignOut } from "phosphor-react";

import logo from "../../assets/logo-yellow.png";
import { useLocationContext } from "../../hooks/location";

import styles from "./styles.module.scss";
import { useAuth } from "../../hooks/auth";
import { useCallback } from "react";

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { geoLocation } = useLocationContext();

  const handleSignOut = useCallback(() => {
    signOut();
    navigate("/");
  }, [signOut, navigate]);

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

          <Link to={!user ? "/signin" : "/profile"} className={styles.order}>
            <User size={22} weight="fill" />
          </Link>

          {user && (
            <button className={styles.signOut} onClick={handleSignOut}>
              <SignOut size={22} weight="fill" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
