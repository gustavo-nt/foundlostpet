import { NavLink, useNavigate } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import { Plus, SignOut } from "phosphor-react";

import { LeafletMap } from "../../components/LeafletMap";
import { useLocationContext } from "../../hooks/location";
import mapIcon from "../../utils/mapIcon";

import logoImg from "../../assets/logo-black.png";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import api from "../../services/disappearanceApi";
import { DisappearanceProps, SituationEnum } from "../../types";

export function Map() {
  const { geoLocation } = useLocationContext();
  const navigate = useNavigate();

  const [disappearances, setDisappearances] = useState(
    [] as DisappearanceProps[],
  );

  useEffect(() => {
    getDisappearances();

    async function getDisappearances() {
      const { data } = await api.get(`/disappearances`);
      setDisappearances(data);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <header>
          <NavLink to="/">
            <img src={logoImg} alt="" />
          </NavLink>

          <h2>Verifique os registros</h2>
          <p>Muitos animais estão querendo retornar para seus lares :)</p>
        </header>

        <footer>
          <strong>
            {geoLocation.city}, {geoLocation.ufCode}
          </strong>
        </footer>
      </div>

      <LeafletMap>
        {disappearances.map((disappearance: DisappearanceProps) => (
          <Marker
            icon={mapIcon}
            key={disappearance.id}
            position={[geoLocation.latitude, geoLocation.longitude]}
          >
            <Popup
              minWidth={160}
              maxWidth={160}
              closeButton={false}
              className="map-popup"
            >
              <div className={styles.popupContent}>
                <span>{disappearance.name}</span>
                <span data-situation={disappearance.situation.toLowerCase()}>
                  {SituationEnum[disappearance.situation]}
                </span>
              </div>
              <button
                className={styles.popupButton}
                title="Acessar desaparecimento"
                onClick={() => navigate(`/disappearance/${disappearance.id}`)}
              >
                <SignOut size={20} color="#fff" />
              </button>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>

      <NavLink
        to="/create-disappearance"
        className={styles.createDisappearances}
      >
        <Plus size="28" color="#fff" />
      </NavLink>
    </div>
  );
}
