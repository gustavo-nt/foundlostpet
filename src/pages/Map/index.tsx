import { NavLink } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import { LeafletMap } from "../../components/LeafletMap";
import { useLocationContext } from "../../contexts/LocationContext";

import { Plus, SignOut } from "phosphor-react";
import mapIcon from "../../utils/mapIcon";

import logoImg from "../../assets/logo-black.png";
import styles from "./styles.module.scss";

export function Map() {
  const { geoLocation } = useLocationContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <header>
          <NavLink to="/">
            <img src={logoImg} alt="" />
          </NavLink>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>
            {geoLocation.city}, {geoLocation.ufCode}
          </strong>
        </footer>
      </div>

      <LeafletMap>
        <Marker
          icon={mapIcon}
          position={[geoLocation.latitude, geoLocation.longitude]}
        >
          <Popup
            minWidth={160}
            maxWidth={160}
            closeButton={false}
            className="map-popup"
          >
            <div className={styles.popupContent}>
              <span>Teste</span>
              <span data-situation={"SIGHNED".toLowerCase()}>Encontrado</span>
            </div>
            <button className={styles.popupButton}>
              <SignOut size={20} color="#fff" />
            </button>
          </Popup>
        </Marker>
      </LeafletMap>

      <NavLink to="/orphanages" className={styles.createDisappearances}>
        <Plus size="28" color="#fff" />
      </NavLink>
    </div>
  );
}
